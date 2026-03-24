# Child Money Management System API Documentation

All base URLs start with `/api`.

## 🔐 Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/register/parent` | Register a new parent account | No |
| POST | `/register/child` | Register a child under current parent | Yes (Parent) |
| POST | `/login` | Authenticate and get JWT | No |
| GET | `/me` | Get current user profile and wallet | Yes |

## 👨‍👩‍👦 Parent Actions (`/parent`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/children` | List all children | Yes (Parent) |
| POST | `/add-money` | Add funds to a child's wallet | Yes (Parent) |
| POST | `/set-limit` | Set monthly spending limit | Yes (Parent) |
| GET | `/requests` | Fetch pending money requests | Yes (Parent) |
| POST | `/approve-request` | Approve or Reject a request | Yes (Parent) |
| POST | `/bank-details` | Securely store encrypted bank info | Yes (Parent) |

## 🧒 Child Actions (`/child`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/wallet/pay` | Simulate a UPI payment | Yes (Child) |
| POST | `/request-money` | Send money request to parent | Yes (Child) |
| GET | `/limit-status` | Get current month's limit progress | Yes (Child) |
| GET | `/transactions` | Get transactions for current child | Yes (Child) |

## 📊 Shared Features
- **Rate Limiting**: 100 requests / 15 mins for general APIs; 10 attempts / hr for auth.
- **Activity Logs**: All financial actions are logged server-side for audit.
