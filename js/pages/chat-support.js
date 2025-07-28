/**
 * Chat Support Page Controller
 * Manages live chat functionality with support agents
 * Mobile-focused with enhanced UX
 */
window.ChatSupportController = {
    /**
     * Initialize the chat support page
     */
    init: function() {
        console.log('ChatSupportController: Initializing chat support page');
        
        this.messages = [];
        this.agentInfo = {
            name: 'أحمد الدعم الفني',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7Yp9mE2LbYp9it2YbYqTwvdGV4dD48L3N2Zz4=',
            status: 'online'
        };
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.setupEventListeners();
        this.setupChatInput();
        this.loadInitialMessages();
        this.scrollToBottom();
        this.setupMobileEnhancements();
        
        console.log('ChatSupportController: Chat support page initialized successfully');
    },

    /**
     * Set up mobile-specific enhancements
     */
    setupMobileEnhancements: function() {
        // Auto-hide keyboard on send
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('blur', () => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            });
        }

        // Touch-friendly quick actions
        document.querySelectorAll('.chat-support-quick-action-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', (e) => {
                e.target.style.transform = '';
            });
        });

        // Swipe to dismiss quick replies
        this.setupSwipeGestures();
    },

    /**
     * Set up swipe gestures for mobile
     */
    setupSwipeGestures: function() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        messagesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        messagesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe with minimal vertical movement
            if (Math.abs(diffX) > 50 && Math.abs(diffY) < 30) {
                if (diffX > 0) {
                    // Swipe left - could be used for quick actions
                    this.handleSwipeLeft();
                } else {
                    // Swipe right - could be used for navigation
                    this.handleSwipeRight();
                }
            }
        });
    },

    /**
     * Handle swipe left gesture
     */
    handleSwipeLeft: function() {
        // Could be used to show quick actions or dismiss elements
        console.log('Swipe left detected');
    },

    /**
     * Handle swipe right gesture
     */
    handleSwipeRight: function() {
        // Could be used for navigation back
        console.log('Swipe right detected');
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('input', (e) => {
                this.handleInputChange(e.target.value);
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send button
        const sendBtn = document.querySelector('[data-action="send-message"]');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Quick reply buttons
        document.querySelectorAll('[data-action="quick-reply"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickReply(e.target);
            });
        });

        // Quick action buttons
        document.querySelectorAll('[data-action="quick-action"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target);
            });
        });

        // Chat actions
        document.querySelectorAll('[data-action="voice-call"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.initiateVoiceCall();
            });
        });

        document.querySelectorAll('[data-action="video-call"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.initiateVideoCall();
            });
        });

        document.querySelectorAll('[data-action="chat-info"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showChatInfo();
            });
        });

        // File attachment
        document.querySelectorAll('[data-action="attach-file"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.attachFile();
            });
        });

        // Emoji picker
        document.querySelectorAll('[data-action="emoji-picker"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showEmojiPicker();
            });
        });
    },

    /**
     * Set up chat input functionality
     */
    setupChatInput: function() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.querySelector('[data-action="send-message"]');
        
        if (chatInput && sendBtn) {
            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
                
                // Enable/disable send button
                sendBtn.disabled = !chatInput.value.trim();
            });

            // Focus management for mobile
            chatInput.addEventListener('focus', () => {
                setTimeout(() => {
                    this.scrollToBottom();
                }, 300);
            });
        }
    },

    /**
     * Load initial messages
     */
    loadInitialMessages: function() {
        // Load existing messages from localStorage or start fresh
        const storedMessages = localStorage.getItem('chatMessages');
        
        if (storedMessages) {
            this.messages = JSON.parse(storedMessages);
        } else {
            // Initial welcome messages
            this.messages = [
                {
                    id: 1,
                    type: 'agent',
                    content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    agent: this.agentInfo
                }
            ];
        }
        
        this.renderMessages();
    },

    /**
     * Render messages
     */
    renderMessages: function() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        // Clear existing messages (except typing indicator)
        const typingIndicator = document.getElementById('typingIndicator');
        messagesContainer.innerHTML = '';
        if (typingIndicator) {
            messagesContainer.appendChild(typingIndicator);
        }

        // Render messages
        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        this.scrollToBottom();
    },

    /**
     * Create message element
     */
    createMessageElement: function(message) {
        const element = document.createElement('div');
        element.className = `chat-support-message chat-support-message-${message.type}`;
        element.dataset.messageId = message.id;

        const time = this.formatTime(message.timestamp);

        if (message.type === 'agent') {
            element.innerHTML = `
                <div class="chat-support-message-avatar">
                    <img src="${message.agent.avatar}" alt="${message.agent.name}">
                </div>
                <div class="chat-support-message-content">
                    <div class="chat-support-message-bubble">
                        ${this.formatMessageContent(message)}
                        <span class="chat-support-message-time">${time}</span>
                    </div>
                </div>
            `;
        } else {
            element.innerHTML = `
                <div class="chat-support-message-content">
                    <div class="chat-support-message-bubble">
                        ${this.formatMessageContent(message)}
                        <span class="chat-support-message-time">${time}</span>
                    </div>
                </div>
            `;
        }

        return element;
    },

    /**
     * Format message content
     */
    formatMessageContent: function(message) {
        if (message.content.type === 'shipment-info') {
            return this.createShipmentInfoContent(message.content.data);
        } else if (message.content.type === 'quick-replies') {
            return this.createQuickRepliesContent(message.content.options);
        } else {
            return `<p>${message.content}</p>`;
        }
    },

    /**
     * Create shipment info content
     */
    createShipmentInfoContent: function(shipmentData) {
        return `
            <div class="chat-support-shipment-info">
                <h4>معلومات الشحنة ${shipmentData.id}</h4>
                <div class="chat-support-shipment-details">
                    <div class="chat-support-detail-item">
                        <span class="chat-support-detail-label">الحالة:</span>
                        <span class="chat-support-detail-value status-${shipmentData.status}">${shipmentData.statusText}</span>
                    </div>
                    <div class="chat-support-detail-item">
                        <span class="chat-support-detail-label">الموقع الحالي:</span>
                        <span class="chat-support-detail-value">${shipmentData.currentLocation}</span>
                    </div>
                    <div class="chat-support-detail-item">
                        <span class="chat-support-detail-label">تاريخ الوصول المتوقع:</span>
                        <span class="chat-support-detail-value">${shipmentData.eta}</span>
                    </div>
                    <div class="chat-support-detail-item">
                        <span class="chat-support-detail-label">نسبة الإنجاز:</span>
                        <span class="chat-support-detail-value">${shipmentData.progress}%</span>
                    </div>
                </div>
                <div class="chat-support-shipment-progress">
                    <div class="chat-support-progress-bar">
                        <div class="chat-support-progress-fill" style="width: ${shipmentData.progress}%"></div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create quick replies content
     */
    createQuickRepliesContent: function(options) {
        const buttons = options.map(option => 
            `<button class="chat-support-quick-reply-btn" data-action="quick-reply" data-text="${option}">${option}</button>`
        ).join('');
        
        return `<div class="chat-support-quick-replies">${buttons}</div>`;
    },

    /**
     * Handle input change
     */
    handleInputChange: function(value) {
        const sendBtn = document.querySelector('[data-action="send-message"]');
        if (sendBtn) {
            sendBtn.disabled = !value.trim();
        }
    },

    /**
     * Send message
     */
    sendMessage: function() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage({
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Disable send button
        const sendBtn = document.querySelector('[data-action="send-message"]');
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate agent response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateAgentResponse(message);
        }, 2000);
    },

    /**
     * Add message to chat
     */
    addMessage: function(messageData) {
        const message = {
            id: Date.now(),
            ...messageData
        };
        
        this.messages.push(message);
        this.renderMessages();
        this.saveMessages();
    },

    /**
     * Generate agent response
     */
    generateAgentResponse: function(userMessage) {
        let response;
        
        // Simple response logic based on user message
        if (userMessage.includes('تتبع') || userMessage.includes('شحنة')) {
            response = {
                type: 'agent',
                content: {
                    type: 'shipment-info',
                    data: {
                        id: 'INT-4521',
                        status: 'active',
                        statusText: 'قيد النقل',
                        currentLocation: 'ميناء جدة',
                        eta: '18 يناير 2025',
                        progress: 75
                    }
                },
                timestamp: new Date().toISOString(),
                agent: this.agentInfo
            };
        } else if (userMessage.includes('دفع') || userMessage.includes('مال')) {
            response = {
                type: 'agent',
                content: 'يمكنني مساعدتك في مشاكل الدفع. هل تواجه مشكلة في عملية دفع معينة؟',
                timestamp: new Date().toISOString(),
                agent: this.agentInfo
            };
        } else {
            response = {
                type: 'agent',
                content: 'شكراً لك على رسالتك. سأقوم بمساعدتك في أقرب وقت ممكن. هل هناك شيء محدد تحتاج مساعدة فيه؟',
                timestamp: new Date().toISOString(),
                agent: this.agentInfo
            };
        }
        
        this.addMessage(response);
    },

    /**
     * Handle quick reply
     */
    handleQuickReply: function(button) {
        const text = button.dataset.text;
        
        // Add user message
        this.addMessage({
            type: 'user',
            content: text,
            timestamp: new Date().toISOString()
        });
        
        // Generate response based on quick reply
        setTimeout(() => {
            this.generateAgentResponse(text);
        }, 1000);
    },

    /**
     * Handle quick action
     */
    handleQuickAction: function(button) {
        const text = button.dataset.text;
        
        // Add user message
        this.addMessage({
            type: 'user',
            content: text,
            timestamp: new Date().toISOString()
        });
        
        // Generate response
        setTimeout(() => {
            this.generateAgentResponse(text);
        }, 1000);
    },

    /**
     * Show typing indicator
     */
    showTypingIndicator: function() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'block';
            this.scrollToBottom();
        }
    },

    /**
     * Hide typing indicator
     */
    hideTypingIndicator: function() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    },

    /**
     * Scroll to bottom of chat
     */
    scrollToBottom: function() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    /**
     * Format time for display
     */
    formatTime: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) {
            return 'الآن';
        } else if (diffMinutes < 60) {
            return `منذ ${diffMinutes} دقيقة`;
        } else {
            return date.toLocaleTimeString('ar-SA', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    },

    /**
     * Save messages to localStorage
     */
    saveMessages: function() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    },

    /**
     * Initiate voice call
     */
    initiateVoiceCall: function() {
        Toast.show('بدء المكالمة الصوتية', 'جاري الاتصال...', 'info');
        // Implementation for voice call
    },

    /**
     * Initiate video call
     */
    initiateVideoCall: function() {
        Toast.show('بدء مكالمة الفيديو', 'جاري الاتصال...', 'info');
        // Implementation for video call
    },

    /**
     * Show chat info
     */
    showChatInfo: function() {
        Modal.open('chat-info', {
            title: 'معلومات الدردشة',
            content: `
                <div class="chat-info">
                    <div class="agent-info">
                        <img src="${this.agentInfo.avatar}" alt="${this.agentInfo.name}">
                        <h4>${this.agentInfo.name}</h4>
                        <p>متصل الآن</p>
                    </div>
                    <div class="chat-stats">
                        <div class="stat">
                            <span class="label">عدد الرسائل:</span>
                            <span class="value">${this.messages.length}</span>
                        </div>
                        <div class="stat">
                            <span class="label">وقت البدء:</span>
                            <span class="value">${this.formatTime(this.messages[0]?.timestamp || Date.now())}</span>
                        </div>
                    </div>
                </div>
            `
        });
    },

    /**
     * Attach file
     */
    attachFile: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.doc,.docx';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadFile(file);
            }
        };
        input.click();
    },

    /**
     * Upload file
     */
    uploadFile: function(file) {
        // Show upload progress
        Toast.show('جاري رفع الملف', 'يرجى الانتظار...', 'info');
        
        // Simulate file upload
        setTimeout(() => {
            this.addMessage({
                type: 'user',
                content: `تم رفع الملف: ${file.name}`,
                timestamp: new Date().toISOString(),
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            });
            
            Toast.show('تم رفع الملف', 'تم رفع الملف بنجاح', 'success');
        }, 2000);
    },

    /**
     * Show emoji picker
     */
    showEmojiPicker: function() {
        // Simple emoji picker implementation
        const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏'];
        
        Modal.open('emoji-picker', {
            title: 'اختر رمز تعبيري',
            content: `
                <div class="emoji-picker">
                    ${emojis.map(emoji => 
                        `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`
                    ).join('')}
                </div>
            `,
            onConfirm: (selectedEmoji) => {
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.value += selectedEmoji;
                    chatInput.focus();
                }
            }
        });
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        console.log('ChatSupportController: Destroying chat support page');
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
    }
}; 