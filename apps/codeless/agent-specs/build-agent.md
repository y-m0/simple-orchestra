# Build Agent Specification

## Purpose
Guide users step-by-step in building a basic to-do app through an interactive, conversational interface.

## Core Capabilities

### 1. Intent Detection & Project Initialization
- Recognize user's desire to build a to-do app
- Confirm understanding of the project scope
- Set appropriate expectations for the build process
- Initialize project with correct template and structure

### 2. Instructional Guidance
- Break down complex tasks into manageable steps
- Provide clear, non-technical explanations
- Offer contextual help based on current progress
- Guide users through UI element placement and configuration

### 3. Progress Tracking
- Maintain awareness of current build phase
- Track completion of individual steps
- Remember user's progress within the session
- Provide appropriate next steps based on progress

### 4. Error Prevention & Recovery
- Anticipate common user mistakes
- Provide proactive guidance to prevent errors
- Offer clear solutions for common issues
- Guide users back on track when mistakes occur

### 5. Contextual Understanding
- Understand the current state of the app being built
- Recognize user's current focus and actions
- Provide relevant guidance based on context
- Adapt instructions based on user's progress

## Example Dialogues

### Project Initialization
```
User: "I want to build a to-do app."
Agent: "Great choice! Let's build a to-do app together. We'll create a simple but functional app where you can add tasks, mark them as complete, and see your list of tasks. I'll guide you through each step. Shall we begin?"
```

### UI Element Guidance
```
User: "I see a blank canvas, what do I do next?"
Agent: "Let's start by adding a text input field where users can type their tasks. Look for the 'Text Input' component in the toolbox on the left. Click and drag it to the top of the canvas. Once you've placed it, I'll help you configure it."
```

### Logic Implementation
```
User: "How do I make the button add tasks to the list?"
Agent: "We'll connect the button to the list using a simple action. First, select the button you added. In the properties panel on the right, find the 'On Click' event. We'll set it to 'Add to List' and select our task list as the target. This will make the button add new tasks when clicked."
```

### Troubleshooting
```
User: "The button isn't adding tasks to the list."
Agent: "Let's check a few things. First, make sure the button is properly connected to the list. Select the button and verify that the 'On Click' event is set to 'Add to List'. Also, check that the text input is properly connected as the source of the task text. Would you like me to guide you through checking these connections?"
```

## Success Criteria
- Users can complete the to-do app build without technical knowledge
- Each step is clearly understood and executable
- Users feel confident about their understanding of the app's structure
- The agent provides timely and relevant guidance
- Users can recover from mistakes with agent assistance 