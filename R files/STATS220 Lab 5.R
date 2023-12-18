library(lubridate)
library(tidyverse)
step_count_raw <- read_csv("data/step-count/step-count.csv",
                           locale = locale(tz = "Australia/Melbourne"))
location <- read_csv("data/step-count/location.csv")
step_count <- step_count_raw %>% 
  rename_with(~ c("date_time", "date", "count")) %>% 
  left_join(location) %>% 
  mutate(location = replace_na(location, "Melbourne"))
step_count
city_avg_steps <- step_count %>%
  mutate(date = floor_date(date))%>%
  group_by(date, location)%>%
  summarise(avg_count = sum(count)) %>%
  group_by(location) %>%
  summarise(avg_count = mean(avg_count))
p1 <- ggplot(city_avg_steps, aes(x = location, y = avg_count)) +
  geom_segment(aes(x = location, xend = location, y = 0, yend = avg_count)) +
  geom_point(size = 4, colour = "#dd1c77")
step_count_time <- step_count %>%
  mutate(time = hour(date_time),
         country = case_when(
           location == "Melbourne" ~ "AU",
           location != "Melbourne" ~ "US"
         ))
p2 <- ggplot(step_count_time, aes(x = time, group = time, y = count)) + 
  geom_boxplot(outlier.size = 1)
p3 <- p2 + facet_wrap(~ country, nrow = 2)