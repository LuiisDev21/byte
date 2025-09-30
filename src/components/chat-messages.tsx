import { ChatMessage as Message } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { LoadingIndicator } from "@/components/loading-indicator";

interface ChatMessagesProps {
    messages: Message[];
    isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
    const lastMessage = messages[messages.length - 1];
    const shouldShowGlobalIndicator = isLoading && (!lastMessage || lastMessage.role !== "assistant");

    return (
        <div className="space-y-4">
            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isLoading={isLoading}
                />
            ))}

            {shouldShowGlobalIndicator && <LoadingIndicator />}
        </div>
    );
}