# HackZero API

API endpoints that connect to the fronted client for HackZero. Purpose of this is to manage hackathon event for any organizations.

## Functionality / Features

- User registration
- User authentication
- Adding hackathon ideas
- Editing hackathon ideas
- Providing users created hacks listing
- Join team to work on hacks

## Target Audience

This backend app is targeted at people who needs to connect their frontend client to be able to perform CRUD operation for their hackathons within their organizatios.

## Tech Stack

- MongoDB
- AWS API Gateway
- AWS Lambda
- AWS Cognito Authentication
- Serverless Framework

## Application Architecture Diagram

![diagram](./docs/architectureDiagram.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1. **git clone git@github.com:hackthehack/hack-zero-v2-backend.git**

2. cd into the directory and run **npm install**

3. Run a local server by running '**sls offline start**'

### Prerequisites

1. Must have NodeJS runtime installed

2. Install serverless framework by running **npm install -g serverless**

### Demo

A demo version of this service is hosted on AWS - [`https://z6pv80ao4l.execute-api.us-east-1.amazonaws.com/dev/hello`](https://z6pv80ao4l.execute-api.us-east-1.amazonaws.com/dev/hello)

And here is the ES7 source behind it

```javascript
export const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
      input: event,
    }),
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
```

#### Environment Variables

To add environment variables to your project

1. Rename `env.example` to `.env`.
2. Add environment variables for your local stage to `.env`.
3. Uncomment `environment:` block in the `serverless.yml` and reference the environment variable as `${env:MY_ENV_VAR}`. Where `MY_ENV_VAR` is added to your `.env` file.
4. Make sure to not commit your `.env`.

#### Running Tests

Run your tests using

```bash
$ npm test
```

We use Jest to run our tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content)

## Accessing and using a database behind proxy

There might be restrictions behind company firewall for accessing cloud database provider such as mlab. The solutiion is to run a local development mongoDB instance with docker.

### Make sure you have docker installed and running

```
docker pull mongo
```

### From the root of the project run:

1. docker-compose up -d

### Optional steps to grab test data from cloud database mlab

1. docker exec -it _containerID_ bash

2. mkdir home/dump

```javascript
mongodump -h ds157136.mlab.com:57136 -d hackone -u yourusername -p yourpassword -o home/dump
```

```javascript
mongorestore / home / dump;
```

## To confirm run:

**enter mongo interactive shell**

```
mongo
```

```
show dbs

```

_Should show hackone as one of the dbs_

```
admin    0.000GB
config   0.000GB
hackone  0.000GB
local    0.000GB
```

#### Deployment

1. Deploy locally with:

```bash
$ serverless deploy
```

2. Deploy only one function:

```bash
$ serverless deploy function --function hello
```

3. Deploy with github actions

Please swap out your cloud provider details in **serverless.yml** and also in **./github/workflows/main.yml**.

For more information please visit: [info](https://github.com/features/actions)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/josephgarner"><img src="https://avatars0.githubusercontent.com/u/24267716?v=4" width="100px;" alt=""/><br /><sub><b>Joseph Garner</b></sub></a><br /><a href="https://github.com/hackthehack/hack-zero-v2-backend/commits?author=josephgarner" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jpeyper"><img src="https://avatars2.githubusercontent.com/u/6560018?v=4" width="100px;" alt=""/><br /><sub><b>Jonathan Peyper</b></sub></a><br /><a href="https://github.com/hackthehack/hack-zero-v2-backend/commits?author=jpeyper" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/HuangStanley050"><img src="https://avatars0.githubusercontent.com/u/33140495?v=4" width="100px;" alt=""/><br /><sub><b>Stanley Huang</b></sub></a><br /><a href="https://github.com/hackthehack/hack-zero-v2-backend/commits?author=HuangStanley050" title="Code">💻</a></td>
    <td align="center"><a href="https://au.linkedin.com/in/danieltongaus"><img src="https://avatars3.githubusercontent.com/u/1935231?v=4" width="100px;" alt=""/><br /><sub><b>Daniel Tong</b></sub></a><br /><a href="https://github.com/hackthehack/hack-zero-v2-backend/commits?author=danieltongaus" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
