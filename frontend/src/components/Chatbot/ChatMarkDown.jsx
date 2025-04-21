import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Box } from "@chakra-ui/react";
import { useMarkdownComponents } from "./MarkDownComponents";
import PropTypes from "prop-types";

const ChatMarkdown = ({ content }) => {
  const components = useMarkdownComponents();

  return (
    <Box w="100%" overflowX="auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

ChatMarkdown.propTypes = {
  content: PropTypes.string.isRequired,
};

export default ChatMarkdown;
