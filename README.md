# vpp-webapp
VPP Parking Web Application [GIS]
Development Instructions/ Notes
##To build Environment
1. sudo npm install

2. bower install

    - Make sure to pick at least Angular 1.4 to prevent errors

3. cd to server folder and run npm start to start data service

    - Data service runs the Map and Data pages.  

    - Server runs on port 3003 when running app in localhost mode.

4. There are two ways to use data.

    - development

      - var devDataUrl = "http://localhost:3003";

    - public

      - var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";

    - public may not be the most up to date api 

5. then cd back to top level folder for app and run gulp serve

Browser should open at or navigate to localhost:3000

