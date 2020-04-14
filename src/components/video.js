import React, { useState, useEffect, useRef } from 'react';
import VideoCall from '../helpers/simple-peer';
import '../styles/video.css';
import io from 'socket.io-client';
import Chat from './CustomChat';

const VideoWithHooks  = ({ match }) => {
  // use refs for these vars so they exist outside of state
  // we initialise socket listeners on render, and the closure means stale state is referenced.
  // See https://stackoverflow.com/questions/54675523/state-inside-useeffect-refers-the-initial-state-always-with-react-hooks
  const peer = useRef({});
  const localStream = useRef({});
  const localVideo = useRef();
  const remoteVideo = useRef();
  // this MUST be true for peer to signal
  const initiator = useRef(false);
  const [full, setFull] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [waiting, setWaiting] = useState(true)
  const [messages, setMessages] = useState([])
  const [partnerTyping, setPartnerTyping] = useState(false)

  const [socket, setSocket] = useState(io(process.env.REACT_APP_SIGNALING_SERVER))
  const [roomId, setRoomId] = useState(match.params.roomId);

  const videoCall = new VideoCall();

  // component did mount
  useEffect(() => {
    getUserMedia().then(() => {
      socket.emit('join', { roomId: roomId });
    });

    socket.on('init', () => {
      initiator.current = true;
    });

    socket.on('ready', () => {
      enter(roomId);
    });

    socket.on('desc', data => {
      if (data.type === 'offer' && initiator.current) return;
      if (data.type === 'answer' && !initiator.current) return;
      call(data);
    });

    socket.on('disconnected', () => {
      initiator.current = true;
    });

    socket.on('full', () => {
      setFull(true);
    });

    socket.on('newChatMessage',
      (message) => {
        setMessages(prev => prev.concat(message));
      }
    );

    socket.on('typing',
      ({ typing }) => {
        setPartnerTyping(typing)
      }
    );
  }, [])


  const getUserMedia = () => new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia = ( navigator.mediaDevices.getUserMedia ||
                       navigator.mediaDevices.webkitGetUserMedia ||
                       navigator.mediaDevices.mozGetUserMedia ||
                       navigator.mediaDevices.msGetUserMedia);
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 }
        },
        // require audio
        audio: true
      };
      navigator.mediaDevices.getUserMedia(op)
        .then(stream => {
          localStream.current = stream;
          localVideo.current.srcObject = stream;
          resolve();
        })
        .catch(err => console.log(err) || reject(err))
    });

  const enter = roomId => {
    setConnecting(true)
    
    const peerObject = videoCall.init(
      localStream.current,
      initiator.current
    );

    peerObject.on('signal', data => {
      console.log('peer signal')
      const signal = {
        room: roomId,
        desc: data
      };
      socket.emit('signal', signal);
    });

    peerObject.on('stream', stream => {
      remoteVideo.current.srcObject = stream;
      setConnecting(false);
      setWaiting(false);
    });

    peerObject.on('error', (err) => {
      console.log(err);
    });
    peer.current = peerObject;

  };

  const call = otherId => {
    videoCall.connect(otherId);
  };

  const renderFull = () => {
    if (full) {
      return 'The room is full';
    }
  };

  const sendMessage = ({ message, roomId }) => {
    socket.emit('stoppedTyping', { typing: false })
    socket.emit('newChatMessage', { message, roomId });
  };

  const setClientTyping = (typing) => socket.emit('typing', { typing, roomId });

  return (
      <div className='video-wrapper'>
        <div className='local-video-wrapper'>
          <video
            autoPlay
            id='localVideo'
            muted
            ref={localVideo}
          />
        </div>
        <video
          autoPlay
          className={`${
            connecting || waiting ? 'hide' : ''
          }`}
          id='remoteVideo'
          ref={remoteVideo}
        />
        <div style={{ background: 'white' }}>
        {socket && <Chat
          clientId={socket.id}
          roomId={roomId}
          sendMessage={sendMessage}
          messages={messages}
          setClientTyping={setClientTyping}
          partnerTyping={partnerTyping}
        /> }
        </div>
        {connecting && (
          <div className='status'>
            <p>Establishing connection...</p>
          </div>
        )}
        {waiting && (
          <div className='status'>
            <p>Waiting for someone...</p>
          </div>
        )}
        {renderFull()}
      </div>
    );
}


export default VideoWithHooks;
