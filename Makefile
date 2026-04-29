# Database Connection Settings
DB_SERVER = localhost,1433
DB_NAME = stackra
DB_USER = sa
DB_PASS = Strong@Password123

# SQLCMD Command
SQLCMD = sqlcmd -S $(DB_SERVER) -d $(DB_NAME) -U $(DB_USER) -P $(DB_PASS) -y 30 -Y 30

.PHONY: db-tables db-columns db-data db-query help

help:
	@echo Stackra Database Management Commands:
	@echo   make db-tables             - List all tables in the database
	@echo   make db-columns table=X     - Show columns for table X
	@echo   make db-data table=X        - Show all data from table X
	@echo   make db-query sql="..."     - Run a custom SQL query

db-tables:
	@$(SQLCMD) -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME"

db-columns:
	@if "$(table)"=="" (echo Error: table variable is required. Example: make db-columns table=Users & exit 1)
	@$(SQLCMD) -Q "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH as MAX_LEN, IS_NULLABLE as NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '$(table)' ORDER BY ORDINAL_POSITION"

db-data:
	@if "$(table)"=="" (echo Error: table variable is required. Example: make db-data table=Users & exit 1)
	@$(SQLCMD) -Q "SELECT * FROM $(table)"

db-query:
	@if "$(sql)"=="" (echo Error: sql variable is required. Example: make db-query sql="SELECT TOP 5 * FROM Users" & exit 1)
	@$(SQLCMD) -Q "$(sql)"
