# vpp-webapp
VPP Parking Web Application [GIS]
Development Instructions/ Notes
##To build Environment
1. sudo npm install
2. bower install
  a. Make sure to pick at least Angular 1.4 to prevent errors
3. cd to server folder and run npm start to start data service
  a. Data service runs the Map and Data pages.  
  b. Server runs on port 3003 when running app in localhost mode.
  c. There are two ways to use data.
      i. development
          a. var devDataUrl = "http://localhost:3003";
      ii. public
          b. var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";
      iii. public may not be the most up to date api 
4. then cd back to top level folder for app and run gulp serve
5. Browser should open at or navigate to localhost:3000

