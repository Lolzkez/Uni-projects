library(tidyverse)
user_reviews <- read_tsv("data/animal-crossing/user_reviews.tsv")
user_reviews
user_grade <- user_reviews[[1]]
good_grade <- user_grade >= 7
user_good_grade <- user_reviews[1 == good_grade,c(1,2,4)] 
gapminder <- read_rds("data/gapminder.rds")