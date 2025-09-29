declare module "ai" {
  export const streamText: (args: any) => any
  export type CoreMessage = any
  export const convertToCoreMessages: (messages: any) => any
}
