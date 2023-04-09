import {MultiChatSocket, MultiChatWindow, useMultiChatLogic} from 'react-chat-engine-advanced'
const ChatsPage = (props) => {
    const chatProps = useMultiChatLogic('1dab5819-7e81-463c-bca5-3e5cb1c8eedc', props.user.username, props.user.secret);
    return <div style={{ height: '100vh'}}>
        <MultiChatSocket {...chatProps} />
        <MultiChatWindow {...chatProps} style={{ height: '100vh'}}/>
    </div>
}

export default ChatsPage

// import { PrettyChatWindow } from "react-chat-engine-pretty";

// const ChatsPage = (props) => {
//   return (
//     <div className="background">
//       <PrettyChatWindow
//         projectId={"1dab5819-7e81-463c-bca5-3e5cb1c8eedc"}
//         username={props.user.username}
//         secret={props.user.secret}
//       />
//     </div>
//   );
// };

// export default ChatsPage;