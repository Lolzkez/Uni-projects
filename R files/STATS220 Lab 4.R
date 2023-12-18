library(tidyverse)
step_count_raw <- read_csv("data/step-count/step-count.csv",
  locale = locale(tz = "Australia/Melbourne"))
location <- read_csv("data/step-count/location.csv")
step_count_raw
step_count <- step_count_raw %>%
  rename(date_time = `Date/Time`, 
         date = Date, 
         count = `Step Count (count)`)

step_count_loc <- step_count %>%
  mutate(
    location = case_when(
      ((as.Date("2019-01-15")<=date) == TRUE & (date<=as.Date("2019-01-25")) == TRUE) ~ "Austin",
      ((as.Date("2019-07-28")<=date) == TRUE & (date<=as.Date("2019-08-01")) == TRUE) ~ "Denver",
      ((as.Date("2019-08-02")<=date) == TRUE & (date<=as.Date("2019-08-06")) == TRUE) ~ "San Francisco"
    )
  )

step_count_full <- step_count_loc %>%
  mutate(
    location = case_when(
      ((as.Date("2019-01-15")<=date) == TRUE & (date<=as.Date("2019-01-25")) == TRUE) ~ "Austin",
      ((as.Date("2019-07-28")<=date) == TRUE & (date<=as.Date("2019-08-01")) == TRUE) ~ "Denver",
      ((as.Date("2019-08-02")<=date) == TRUE & (date<=as.Date("2019-08-06")) == TRUE) ~ "San Francisco",
      TRUE ~ "Melbourne"
  ))

step_count_daily <- step_count_full %>%
  group_by(date)%>%
  summarise_at(vars(daily_count = count), sum)

step_count_10000 <- step_count_daily %>%
  filter(daily_count >= 10000)
