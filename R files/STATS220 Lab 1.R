x <- seq(200, 400, by=2)
remainder <- x%%3
x2 <- subset(x, remainder == 0)
n_x2 <- length(x2)
sd_of_x2 <- sd(x2)
x2_mean <- mean(x2)
rng_x <- c(x2_mean - (2*sd_of_x2), x2_mean + (2*sd_of_x2))