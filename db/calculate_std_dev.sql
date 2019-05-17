SELECT  (stddev(household_income)/2) AS household_income_stdev,
            max(household_income) AS household_income_max,
            min(household_income) AS household_income_min,
        (stddev(property_value)/2) AS property_value_stdev,
            max(property_value) AS property_value_max,
            min(property_value) AS property_value_min,
        (stddev(commute_time)/2) AS commute_time_stdev,
            max(commute_time) AS commute_time_max,
            min(commute_time) AS commute_time_min,
        (stddev(median_age)/2) AS median_age_stdev,
            max(median_age) AS median_age_max,
            min(median_age) AS median_age_min
FROM county;
