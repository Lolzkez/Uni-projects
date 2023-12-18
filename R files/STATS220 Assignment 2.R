library(lubridate)
library(tidyverse)
nycbikes18 <- read_csv("data/2018-citibike-tripdata.csv",
                       locale = locale(tz = "America/New_York"))
nycbikes18
p1 <- ggplot(nycbikes18, aes(x = start_station_longitude, y =start_station_latitude)) + 
  geom_count(alpha = 0.5) +
  geom_count(data = nycbikes18, aes(x =end_station_longitude , y =end_station_latitude), alpha = 0.5)
Mode <- function(x) {
  ux <- unique(x)
  ux[which.max(tabulate(match(x, ux)))]
}
mode_of_nycbikes18 <- Mode(nycbikes18$bikeid)
top_bike_trips <- filter(nycbikes18, bikeid == mode_of_nycbikes18)
p2 <- ggplot(top_bike_trips, aes(x =start_station_longitude , xend = end_station_longitude , y = start_station_latitude, yend = end_station_latitude))+
  geom_segment(alpha = 0.5)
nycbikes18_age <- nycbikes18 %>%
  mutate(tripduration = tripduration/60,
         birth_year = replace(birth_year, birth_year < 1900, NA_real_ ),
         age = 2018 - birth_year,
         age_group = cut(age, breaks = c(-1,14,24,44,64, Inf), labels = c('[0-14]','(14-24]','(25-44]','(44-64]','65+'), right = TRUE, include.lowest = FALSE))
p3 <- ggplot(nycbikes18_age, aes(x = age_group, y = tripduration, colour = usertype)) +
  geom_boxplot() + scale_y_continuous(trans='log10') + 
  labs(x = "Age Group", y = "Trip in minutes (on log10)")
abc <- nycbikes18 %>%
  mutate(month = month(starttime, label = TRUE)) %>%
  mutate(gender = case_when(gender == 2 ~ "female", gender == 1 ~ "male", gender == 0 ~ "unknown")) %>%
  mutate(gender = as.factor(gender)) %>%
  group_by(month, gender) %>%  
  summarise(ntrips = n()) %>%
  ungroup(gender)%>%
  mutate(gender = fct_reorder(gender, ntrips, min))
p4 <- ggplot(abc, aes(x = gender, y = ntrips, fill = month)) + geom_col(position = "dodge")
cde <- nycbikes18_age %>%
  mutate(month = month(starttime, label = TRUE)) %>%
  group_by(month, age_group) %>%
  summarise(qtl_tripd = quantile(tripduration, 0.75))
p5 <- ggplot(cde, aes(x = month, y = qtl_tripd)) + geom_line(aes(group = age_group, colour = age_group))
top10percent <- nycbikes18_age%>%
  group_by(age_group)%>%
  filter(tripduration > quantile(tripduration, 0.9)) %>%
  group_by(age_group, usertype)%>%
  summarise(n=n())
user_behaviors <- top10percent%>%
  pivot_wider(names_from = usertype, values_from = n)%>%
  rename(`Age Group` = age_group)
hourly_ntrips <- nycbikes18%>%
  mutate(starttime = lubridate::floor_date(starttime, unit = "hour"))%>%
  group_by(starttime, usertype)%>%
  summarise(ntrips = n())%>%
  mutate(startdate = lubridate::as_date(starttime),
         starthour = lubridate::hour(starttime),
         startwday = lubridate::wday(startdate, label = TRUE))
hourly_ntrips%>%
  mutate(startwday = fct_relevel(startwday, "Sun", after = Inf))

p6 <- ggplot(hourly_ntrips) + 
  geom_path(aes(starthour, ntrips, group = startwday, colour = "#bdbdbd"), alpha = 0.5) +   
  scale_y_continuous()+
  facet_grid(usertype~startwday) +
  geom_path(aes(x = starthour, y = mean(ntrips), colour = startwday))
  
