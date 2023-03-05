# dare-avere

A handy Dokerized Tool to keep track of expences with the wifey
Me or my wife can add expenses that should be spitted in half (rent, kindergarden, grocery... others) in this way we will track the amount of money that eachother own. The point is to be absolutely transparent with the other with the money.

# What we will be able to do with this ?

## CRUD of expense

- Read all the expenses, see the balance (who own what to whom), see the montly report, see how much money we spend for a specify category.
- You can add the ammount of money and the percentage you want to split (50% default)! You need to add a description and the date the expense is made, also you could put it in a category
- Modify an incorrect expense value, modifications for amount, percentage, date, will create a new entry and the the old entry will be not be counted but showed for transparency reason. Cathegory will not do that.
- Remove Entry: Each entry will not be removed but deactivated and it will show a lined entry in the sofware.
- List all modified and deleted entries.
- Add / Remove category
- Backup / Export the database
- Mail each month the backupped database.

# TECHS

## Nodejs with TS

NodejS with TS for the back
