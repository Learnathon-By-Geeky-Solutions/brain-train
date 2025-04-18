export const fetchAIResponse = async (message) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    content: `This is a simulated response to your message: "${message}". In a real implementation, this would be replaced with an actual AI response from Anthropic's API or another AI service.`
  };
};
