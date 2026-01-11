# 🧪 Case Crafter – AI-Powered Test Case Generator
![Python](https://img.shields.io/badge/python-3.10+-green.svg)![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-yellow.svg)![React](https://img.shields.io/badge/React-18+-blue.svg)

An intelligent system that automates test case generation from Business Requirements Documents (BRD) using AI and machine learning.
---
## 🌟 Features
### 📄 Document Processing
- **Multi-Format Support:** Process PDF, DOCX, DOC, and TXT document
- **AI-Powered Extraction:** Intelligent requirement extraction using DeepSeek models  
 - **Smart Parsing:** Automatic identification of requirements, sections, and metadata  
- **Quality Assessment:** AI evaluation of document completeness and testability  
### 🤖 AI Test Generation
- **Comprehensive Coverage:** Generates positive, negative, edge, and security test cases  
- **Smart Prioritization:** Automatically assigns priority based on requirement importance  
- **Integration Scenarios:** Creates end-to-end test workflows  
- **Traceability Matrix:** Maintains requirement-to-test case mapping  
### 📊 Advanced Analytics
- **Coverage Analysis:** Visual test coverage across requirements  
- **Quality Metrics:** Test case quality scoring and improvement suggestions
- **Risk Assessment:** Identifies high-risk areas needing more testing  
- **Performance Insights:** Generation time and efficiency metrics
### 🔧 Technical Features
- **Async Processing:** Non-blocking document processing and test generation  
- **Rate Limiting:** Smart API usage with exponential backoff  
- **Caching System:** Reduces redundant API calls  
- **Batch Processing:** Efficient handling of multiple requirements  
- **WebSocket Support:** Real-time progress updates  
---
## 🚀 Quick Start
### Prerequisites
- Python 3.10+  
- Node.js 16+  
- OpenRouter API key (for AI features)
- PostgreSQL (optional, SQLite included)
---
## 📦 Installation
### 1. Clone the repository
```bash
git clone https://github.com/aakifsaf/case_crafter.git
cd case_crafter
```
### 2. Backend Setup 
```bash
cd backend
python -m venv venv
source venv/bin/activate  
# On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OpenRouter API key 
```
### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
### 4. Run the Application
```bash
# Start backend
uvicorn app.main:app --reload
# Start frontend
npm start
```
#### Visit http://localhost:3000
---
## 📁 Project Structure
case-crafter/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── ml/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── docs/

---
## 🔧 Configuration
### Environment Variables
```bash
DATABASE_URL=sqlite:///./test.db
OPENROUTER_API_KEY=your_api_key_here
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=uploads
```
### AI Models Configuration
```bash
FAST_MODEL = "google/gemini-flash-1.5"
SMART_MODEL = "anthropic/claude-3-sonnet"
QUALITY_MODEL = "deepseek/deepseek-coder"
```

---
## 💻 Usage
### 1. Upload BRD Documents
- Upload PDF, DOCX, or TXT
- Automatic requirement extraction
### 2. Review Requirements
- Confidence scores
- Editable and classifiable
### 3. Generate Test Cases
- Basic / Comprehensive / Security-focused
- Real-time progress tracking
### 4. Manage Test Suites
- Test suites & traceability matrices
- Export to Excel, JSON, or PDF
---
## 🧪 Supported Document Types
| Format | Features           | Limitations            |
|--------|--------------------|------------------------|
| PDF    | Text & tables      | Struggles with scans   |
| DOCX   | Full formatting    | Needs python-docx      |
| DOC    | Basic extraction   | Limited formatting     |
| TXT    | Simple parsing     | No structure           |
---
## 🧠 AI Capabilities
### Requirement Extraction
```json
{  "requirement": "The system shall validate user email format during registration",  "type": "functional",  "priority": "high",  "testability": "high",  "confidence": 0.92}
```
### Test Case Generation
```json
{  "id": "TC001",  "name": "Verify email validation during registration",  "type": "positive",  "priority": "high",  "steps": [    "Navigate to registration",    "Enter valid email",    "Submit form"  ],  "expected": "Registration successful"}
```
---
## 📈 Performance
| Operation        | Avg Time   |
|------------------|------------|
| Upload           | 2–5 sec    |
| Extraction       | 3–10 sec   |
| Per Test Gen     | 2–5 sec    |
| 20 Req Suite     | 30–60 sec  |
---
## 🔐 Security Features
- File validation & malware scanning
- API rate limiting
- Encrypted sensitive data
- Audit logs
- RBAC (coming soon)
---
## 🧪 Testing
```bash
pytest tests/
npm test
```
---
## 🚢 Deployment
### Docker
```bash
docker-compose up --build
```
### Manual
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
npm run build
```
### Nginx Config
```nginx
server {  listen 80;  server_name yourdomain.com;}
```
---
## 📊 Monitoring & Logging
- API metrics
- AI token usage
- File processing stats
- Error tracking
---
## 🔄 API Reference
| Endpoint                     | Method | Description              |
|-----------------------------|--------|--------------------------|
| /api/documents/upload       | POST   | Upload documents         |
| /api/requirements/extract   | POST   | Extract requirements     |
| /api/tests/generate         | POST   | Generate test cases      |
| /api/tests/suite            | POST   | Create test suite        |
| /api/analytics/coverage     | GET    | Coverage analytics       |
---
## 🤝 Contributing
1. Fork
2. Create feature branch
3. Commit changes
4. Push branch
5. Open PR
#### Guidelines
- PEP 8
- TypeScript frontend
- Tests + docs
- Conventional commits
---
## 🙏 Acknowledgments
- FastAPI
- React
- OpenRouter
- Contributors & testers
---
Built with ❤️ by the Case Crafter Team