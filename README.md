# Certi_GetAPI: A node.js API to generate and fetch E-certificates
 
 This API takes the user's name as input and generates an e certificate with a certificate id, which could then be used to fetch a copy of the certificate from the API. I would like to thank CuriousJr. team for giving me the opportunity to develop this API.
 
 # Prerequisites
 
 1. Docker: The node app is containerized in Docker so you would need Docker to run the application. It is better if Docker is installed globally on your machine.
 2. Git-Bash AND/OR Postman: In order to test the endpoints of the API.

 # Setting up the API
 
 1. Copy the project into your local machine.
 2. Open Docker and wait for the Docker Engine to start. 
 3. Open Command Prompt/Terminal, navigate to the project and then type the following command.

    ```
    docker-compose up
    ```
    
 4. Above command would read the .yml file in the project and build the project accordingly. Wait until the terminal shows the following message:

    ```
    CuriousJr_Certi | MongoDB connected. You can now start sending requests.
    ```

 5. Now, you are ready to send requests to the API.

 # Usage
 
 The API features three routes/endpoints. The routes are as following.
 
 # Route 1: Welcome route
 
 This is the homepage of the API when you pass the base URL to the browser. This API uses PORT 3000 on the local machine and PORT 8080 on the container. Hence you can access      this route on the git bash as:
 
 ```cURL
 $ curl GET 'http://localhost:3000
 ```
 
 or you can send a GET request on above URl using Postman.
 
 # Route 2: Generate Certificate using name
 
 This is a POST request to the API where data is sent as a JSON object. Please ensure the request header's Content-Type is 'text/plain', 'text/html' or 'application/json'. formt type body would not work.
 The request body would be written as:
 ```json
{
    "name": "Dwaipayan Vidyanta"
} 
 ```
 The API fetches the name from the request body, generates a 7 character long Certificate Id and calls a js script as child process with both name and id passed as argument. The child process generates a certificate using a 1920x1080 solid white .png background stored in the 'assets' folder of the project and uses the npm Jimp library to write the content(username and certiID) in the background. Then the child process stores the certificate image in the database along with name and certificate id and exits. Then the parent process fetches the certificate from the database using the certificate id and sends the image and success status code as the response.
 
 On Git Bash you can use the following example to generate the certificate using this API.
 
 ```
 $ curl -XPOST -d '{"name": "[your-name]"}' -H "Content-Type: application/json" 'http://localhost:3000/generate-certi'
 ```
 
 Here is what the generated certificate looks like:
 
 ---------------------------------------------------------------------------------------------------------------
 ![image](https://user-images.githubusercontent.com/51186857/125657871-deb62794-9cb8-478e-9c79-f213632d3c04.png)
 
 ---------------------------------------------------------------------------------------------------------------

 
 # Route 3: Get Certificate using certificate id
 
 This is a GET request used to fetch the E-certificate using the Certificate Id.Suppose, You have the certificate id of a previously generated certificate and you want to view the file in browser and download it. You can use the following example to fetch your E-Certificate.
 
 ```
 $ curl GET 'http://localhost:3000/get-certi?certi_id=[7 character long certi id]'
 ```
 
 The API finds the record with the certificate id passed in the URL. To open the certificate image in browser type the URl as:
 
 ```
 http://localhost:3000/get-certi?certi_id=[7 character long certi id]
 ```
 
 # Additional features
 
 1. The API is CORS enabled, meaning you can send request to the API from any domain.
 2. In order to change the certificate background simply place your desired background png image in the assets folder of the project and change the path in certi-generate.js.(Marked by comments)
 
 # Problems faced and work-arounds implemented
 
 # Problem
 
 According to the project design the child process(certi_generate.js) was supposed to return the generated image data to the main parent process(server.js) and the image was to be stored on the database by the parent process. Unfortunately, I had never worked on inter-process communication in node.js before and I could not find any resource that would help me achieve what I wanted to implement. I have used the execSync() function of npm child_process module to implement multiprocessing but this function does not allow sharing of data other than console outputs and errors. Hence sending data back to the parent process was a problem.
 
 # My workaround
 
 I tweaked the given design a bit and stored the generated image data(certificate) from the child process itself. Then I used the parent process to fetch the stored data after the child process exits synchronously. This workaround may actually better the consistency and security of API as we are now certain that data is written in the database in a synchronous fashion and not asynchronously. Also it leaves the connection at main parent process free to service the GET requests.
 
 # Final Note
 
 Thank you for reading this far. If you face any issues with the API, feel free to connect to me about it. I would look forward to your feedback:)
 
