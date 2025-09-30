import { ChatMessage as Message } from "@/hooks/use-chat";
import { Markdown } from "@/components/markdown";
import { TypingMarkdown } from "@/components/typing-text";
import { TypingIndicator } from "@/components/typing-indicator";

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
  isLoading: boolean;
}

export function ChatMessage({ message, isLastMessage, isLoading }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isUser = message.role === "user";
  const shouldShowTyping = isAssistant && isLastMessage && isLoading;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {isAssistant && <AssistantAvatar />}
      
      <div className={`max-w-[85%] rounded-lg p-3 ${getMessageStyles(isUser)}`}>
        {isAssistant ? (
          <AssistantMessageContent 
            content={message.content}
            shouldShowTyping={shouldShowTyping}
          />
        ) : (
          <UserMessageContent content={message.content} />
        )}
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
      <p className="text-sm font-bold">B</p>
    </div>
  );
}

function AssistantMessageContent({ content, shouldShowTyping }: { content: string; shouldShowTyping: boolean }) {
  if (shouldShowTyping) {
    return content ? (
      <div aria-live="polite" aria-atomic>
        <TypingMarkdown text={content} speed={40} enabled={true} />
      </div>
    ) : (
      <TypingIndicator />
    );
  }

  return (
    <Markdown className="prose prose-neutral max-w-none dark:prose-invert">
      {content}
    </Markdown>
  );
}

function UserMessageContent({ content }: { content: string }) {
  return (
    <div className="whitespace-pre-wrap leading-7">{content}</div>
  );
}

function getMessageStyles(isUser: boolean): string {
  return isUser
    ? "bg-primary text-primary-foreground"
    : "border bg-card";
}