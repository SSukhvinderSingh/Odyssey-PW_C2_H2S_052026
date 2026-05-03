#!/bin/bash

WORKER_URL="https://election-odyssey-proxy.shawnhps1994.workers.dev/"

echo "🚀 Testing Election Odyssey Worker Proxy..."

# Test 1: Basic Prompt
echo -n "Test 1: Basic Prompt... "
RESPONSE=$(curl -s -X POST $WORKER_URL \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "history": [], "context": {"systemPrompt": "Short answer."}}')

if [[ $RESPONSE == *"candidates"* ]]; then
    echo "✅ PASSED"
else
    echo "❌ FAILED ($RESPONSE)"
fi

# Test 2: Missing Prompt
echo -n "Test 2: Missing Prompt... "
RESPONSE=$(curl -s -X POST $WORKER_URL \
  -H "Content-Type: application/json" \
  -d '{"history": [], "context": {}}')

if [[ $RESPONSE == *"Missing prompt"* ]]; then
    echo "✅ PASSED"
else
    echo "❌ FAILED ($RESPONSE)"
fi

# Test 3: Context/System Prompt
echo -n "Test 3: System Prompt Enforcement... "
RESPONSE=$(curl -s -X POST $WORKER_URL \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Who are you?", "history": [], "context": {"systemPrompt": "Answer ONLY with the word RED."}}')

if [[ $RESPONSE == *"RED"* ]]; then
    echo "✅ PASSED"
else
    echo "❌ FAILED ($RESPONSE)"
fi

echo -e "\nTests Completed."
