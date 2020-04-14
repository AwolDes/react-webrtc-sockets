# WebRTC with react

This is a simple 1-to-1 video chat room example that uses react with WebRTC for video and audio & Sockets for a text chat. This is based off work in this repo: https://github.com/diegogurgel/react-webrtc

![](https://github.com/AwolDes/react-webrtc-sockets/blob/master/screenshot/webrtc-demo.gif)

### Running locally

To run this application you need to create a TURN account. You can create one using this service http://numb.viagenie.ca/cgi-bin/numbacct

Change the `.env.example` to `.env` or `.env.local`

Put your turn account on the .env file

#### The folders

Front-end files are inside `/src` and the server files are inside `/server` folder

#### Install the dependencies

```shell
yarn i
```

#### Start the application

```shell
yarn run start:local
```
