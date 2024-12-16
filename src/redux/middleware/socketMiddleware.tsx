import { Middleware } from "@reduxjs/toolkit";
import socket from "../../util/socket";
import { addDiscussion, addReply } from "../features/discussion/discussionSlice";

export const socketMiddleware: Middleware = (store) => {
    // Listen for socket events
    socket.on("newDiscussion", (discussion) => {
        store.dispatch(addDiscussion(discussion));
    });

    socket.on("newReply", ({ discussionId, reply }) => {
        store.dispatch(addReply({ discussionId, reply }));
    });

    return (next) => (action) => {
        const result = next(action);
        return () => {
            socket.off("newDiscussion");
            socket.off("newReply");
        };
    };
    
};
