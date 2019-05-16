SELECT (stddev(household_income)/2) AS household_income_stdev, 
(stddev(property_value)/2) AS property_value_stdev, 
(stddev(commute_time)/2) AS commute_time_stdev, 
(stddev(median_age)/2) AS median_age_stdev 

FROM county;
