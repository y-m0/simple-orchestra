import pytest
from agent_logic import perform_summarization

def test_empty_input():
    """Test that empty input raises ValueError."""
    with pytest.raises(ValueError):
        perform_summarization("")
    
    with pytest.raises(ValueError):
        perform_summarization(None)
    
    with pytest.raises(ValueError):
        perform_summarization("   ")

def test_single_sentence():
    """Test summarization with a single sentence."""
    text = "This is a single sentence."
    result = perform_summarization(text)
    assert result == text
    
    # Test with trailing whitespace
    text_with_whitespace = "This is a single sentence.   "
    result = perform_summarization(text_with_whitespace)
    assert result == "This is a single sentence."

def test_multiple_sentences():
    """Test summarization with multiple sentences."""
    text = "This is the first sentence. This is the second sentence. This is the third sentence."
    result = perform_summarization(text)
    assert result == "This is the first sentence. This is the second sentence."
    
    # Test with different punctuation
    text_mixed = "This is the first sentence! This is the second sentence? This is the third sentence."
    result = perform_summarization(text_mixed)
    assert result == "This is the first sentence! This is the second sentence?"

def test_complex_text():
    """Test summarization with more complex text."""
    text = """The DataSummarizationAgent is an A2A-compliant service. 
    It provides text summarization capabilities. The agent can be deployed to Cloud Run.
    It uses FastAPI for the API layer. The summarization is currently based on a simple heuristic."""
    
    result = perform_summarization(text)
    # Should only contain the first two sentences
    assert "The DataSummarizationAgent is an A2A-compliant service." in result
    assert "It provides text summarization capabilities." in result
    assert "The agent can be deployed to Cloud Run." not in result