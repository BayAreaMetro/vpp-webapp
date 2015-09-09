NodeJS Template

1. Installed Libraries
	MSSQL -- SQL Server driver
	MongoJS -- MongoDB driver
	Compression -- Gzip compression of server content


2. Middleware
	EnableCORS -- Allow cross-browser requests

3. Templating 
	EJS -- Embedded Javascript (in the /views directory)
	HTML -- HTML files can be placed in the /public directory

4. Main.js
	Renamed from default app.js for Elastic Beanstalk compatibility

5. Default port configuration
	Default is 3000. But also reads server.address().port in case port is different. 
	This is best setup for Elastic Beanstalk. 

6. Run application
	npm start