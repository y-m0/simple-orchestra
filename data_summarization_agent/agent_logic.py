import re

def perform_summarization(text_input: str) -> str:
    """
    Performs text summarization using a simple heuristic approach.
    
    This function takes input text and returns a summary by extracting
    the first two sentences. If the input has fewer than two sentences,
    the entire text is returned.
    
    Args:
        text_input: A string containing the text to be summarized.
        
    Returns:
        A string containing the summarized text.
        
    Raises:
        ValueError: If text_input is None or empty.
    """
    # Validate input
    if text_input is None or not text_input.strip():
        raise ValueError("Input text cannot be empty")
    
    # TODO: Replace this with a sophisticated summarization model call or an MCP tool invocation as per Orchestra Nexus architecture.[1]
    
    # Simple summarization: extract first two sentences
    # This regex handles common sentence-ending punctuation followed by a space or end of string
    sentences = re.split(r'(?<=[.!?])\s+', text_input.strip())
    
    # Filter out empty sentences
    sentences = [s for s in sentences if s.strip()]
    
    if len(sentences) <= 2:
        return text_input.strip()
    else:
        # Join first two sentences with appropriate spacing
        summary = ' '.join(sentences[:2])
        return summary