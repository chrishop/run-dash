# Run Dash Initial Implemetation

I want this to be a SPA react app which performs calculations completely on the client side.
I want the state of the inputs of the app to be stored completely within the URL.

This means that each URL give a determenistic view of the data.

This app will have 2 modes:
- stats mode
- compare mode


## Stats Mode

You will put in your race distance, time and age and gender, min heart rate/max heart rate/ max heart rate for race and it will give you:
- vdot score
  - estimated times of other races given the time in your current race (rounded to seconds)
  - the pace in m per km and m per mile to do achieve the race in that time (rounded to 2 decimal places)
  - your Easy Threshold Interval Repeat Paces, and times for  1200m, 800m, 600m, 400m, 300m, 200m workouts
- age-grading percentage
  - give a percentage and have an explainer to explain what the percentages mean
  - have a table to to show the same age-grading percentage across age and gender (in 5 year increments)
- lactate treshold
  - use the heart rate scores and pace to calculate lactate threshold for both pace and heart rate
