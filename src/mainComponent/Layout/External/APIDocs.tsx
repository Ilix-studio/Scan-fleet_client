import { useState } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Webhook,
  Wallet,
  Package,
  Key,
  Users,
  ExternalLink,
  Terminal,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface CodeExample {
  lang: string;
  label: string;
  code: string;
}

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  params?: Param[];
  body?: Param[];
  response: string;
  codes?: CodeExample[];
}

interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  endpoints: Endpoint[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "auth",
    label: "Authentication",
    icon: Key,
    color: "from-cyan-500 to-blue-500",
    endpoints: [
      {
        method: "GET",
        path: "/api/external/v1/wallet/balance",
        description: "Verify API credentials and check dealer token balance.",
        response: `{
  "success": true,
  "data": {
    "userId": "673abc...",
    "walletBalance": 45,
    "lifetimeTokensPurchased": 100,
    "lifetimeTokensUsed": 55,
    "lastPurchaseDate": "2024-02-15T10:30:00.000Z"
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `import fetch from 'node-fetch';

const API_KEY    = process.env.SCANFLEET_API_KEY;
const API_SECRET = process.env.SCANFLEET_API_SECRET;
const BASE_URL   = 'https://api.scanfleet.in';

const authHeader = 'Basic ' + 
  Buffer.from(\`\${API_KEY}:\${API_SECRET}\`).toString('base64');

const res  = await fetch(\`\${BASE_URL}/api/external/v1/wallet/balance\`, {
  headers: { Authorization: authHeader }
});
const data = await res.json();
console.log(data.data.walletBalance); // 45`,
          },
        ],
      },
    ],
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: Wallet,
    color: "from-purple-500 to-pink-500",
    endpoints: [
      {
        method: "GET",
        path: "/api/external/v1/wallet/balance",
        description: "Returns current token balance and lifetime usage stats.",
        response: `{
  "success": true,
  "data": {
    "walletBalance": 45,
    "lifetimeTokensPurchased": 100,
    "lifetimeTokensUsed": 55
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `const res  = await fetch(\`\${BASE_URL}/api/external/v1/wallet/balance\`, {
  headers: { Authorization: authHeader }
});
const { data } = await res.json();

if (data.walletBalance < 1) {
  throw new Error('Insufficient tokens');
}`,
          },
        ],
      },
      {
        method: "GET",
        path: "/api/external/v1/wallet/history",
        description: "Paginated token transaction history.",
        params: [
          {
            name: "page",
            type: "number",
            required: false,
            description: "Page number (default: 1)",
          },
          {
            name: "limit",
            type: "number",
            required: false,
            description: "Records per page (default: 20)",
          },
          {
            name: "startDate",
            type: "ISO date",
            required: false,
            description: "Filter from date",
          },
          {
            name: "endDate",
            type: "ISO date",
            required: false,
            description: "Filter to date",
          },
        ],
        response: `{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": { "page": 1, "limit": 20, "total": 55 }
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `const params = new URLSearchParams({ page: '1', limit: '20' });
const res    = await fetch(
  \`\${BASE_URL}/api/external/v1/wallet/history?\${params}\`,
  { headers: { Authorization: authHeader } }
);
const { data } = await res.json();`,
          },
        ],
      },
    ],
  },
  {
    id: "attach-codes",
    label: "Attach Codes",
    icon: Tag,
    color: "from-green-500 to-cyan-500",
    endpoints: [
      {
        method: "GET",
        path: "/api/external/v1/attach-codes/:code/status",
        description: "Check whether an attach code is available for binding.",
        params: [
          {
            name: "code",
            type: "string",
            required: true,
            description: "Attach code (e.g. AC-XY7Z8W9Q)",
          },
        ],
        response: `{
  "success": true,
  "data": {
    "attachCode": "AC-XY7Z8W9Q",
    "status": "AVAILABLE",
    "available": true,
    "qrId": "uuid-v4",
    "expiresAt": "2025-06-01T00:00:00.000Z",
    "boundAt": null
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `const code = 'AC-XY7Z8W9Q';
const res  = await fetch(
  \`\${BASE_URL}/api/external/v1/attach-codes/\${code}/status\`,
  { headers: { Authorization: authHeader } }
);
const { data } = await res.json();

if (!data.available) {
  throw new Error(\`Attach code \${data.status}\`);
}`,
          },
        ],
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: Package,
    color: "from-orange-500 to-red-500",
    endpoints: [
      {
        method: "POST",
        path: "/api/external/v1/orders/bind-attach-code",
        description:
          "Atomic operation: validates attach code → consumes 1 token (FIFO) → binds customer data. Use after pre-checkout validation.",
        body: [
          {
            name: "attachCode",
            type: "string",
            required: true,
            description: "Physical attach code from package",
          },
          {
            name: "customerData.stickerUserName",
            type: "string",
            required: true,
            description: "Vehicle owner full name",
          },
          {
            name: "customerData.primaryPhoneNumber",
            type: "string",
            required: true,
            description: "Owner phone (E.164 format)",
          },
          {
            name: "customerData.emergencyContact1",
            type: "string",
            required: true,
            description: "Emergency contact 1",
          },
          {
            name: "customerData.emergencyContact2",
            type: "string",
            required: false,
            description: "Emergency contact 2",
          },
          {
            name: "customerData.vehicleDetails",
            type: "object",
            required: true,
            description: "Vehicle number, type, model",
          },
          {
            name: "shippingAddress",
            type: "object",
            required: false,
            description: "Delivery address for physical sticker",
          },
        ],
        response: `{
  "success": true,
  "data": {
    "tokenId": "TKN-XXXX",
    "qrId": "uuid-v4",
    "attachCode": "AC-XY7Z8W9Q",
    "status": "BOUND",
    "remainingBalance": 44,
    "maskedNumber": "+91-XXXXX-43210"
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `// Step 1 – Pre-checkout validation (run before payment)
async function validateScanFleetOrder(attachCode) {
  const [balRes, codeRes] = await Promise.all([
    fetch(\`\${BASE_URL}/api/external/v1/wallet/balance\`, {
      headers: { Authorization: authHeader }
    }),
    fetch(\`\${BASE_URL}/api/external/v1/attach-codes/\${attachCode}/status\`, {
      headers: { Authorization: authHeader }
    }),
  ]);

  const { data: wallet } = await balRes.json();
  const { data: code   } = await codeRes.json();

  if (wallet.walletBalance < 1) throw new Error('Out of tokens');
  if (!code.available)          throw new Error('Attach code unavailable');

  return true;
}

// Step 2 – Bind after payment confirmation
async function bindAttachCode(attachCode, customer) {
  const res = await fetch(
    \`\${BASE_URL}/api/external/v1/orders/bind-attach-code\`,
    {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attachCode,
        customerData: {
          stickerUserName:    customer.name,
          primaryPhoneNumber: customer.phone,
          emergencyContact1:  customer.ec1,
          emergencyContact2:  customer.ec2,
          vehicleDetails: {
            vehicleNumber: customer.vehicleNumber,
            vehicleType:   customer.vehicleType,
            vehicleModel:  customer.vehicleModel,
          },
        },
        shippingAddress: customer.address,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Bind failed');
  }

  return await res.json(); // { tokenId, qrId, remainingBalance }
}`,
          },
        ],
      },
      {
        method: "GET",
        path: "/api/external/v1/orders/:tokenId",
        description: "Get order status and tracking details.",
        params: [
          {
            name: "tokenId",
            type: "string",
            required: true,
            description: "Token ID returned from bind endpoint",
          },
        ],
        response: `{
  "success": true,
  "data": {
    "tokenId": "TKN-XXXX",
    "status": "PROCESSING",
    "attachCode": "AC-XY7Z8W9Q",
    "customerDataSubmittedAt": "2024-02-15T10:30:00.000Z",
    "shippedAt": null,
    "deliveredAt": null
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `const tokenId = 'TKN-XXXX';
const res     = await fetch(
  \`\${BASE_URL}/api/external/v1/orders/\${tokenId}\`,
  { headers: { Authorization: authHeader } }
);
const { data } = await res.json();
console.log(data.status); // PROCESSING`,
          },
        ],
      },
    ],
  },
  {
    id: "webhooks",
    label: "Webhooks",
    icon: Webhook,
    color: "from-pink-500 to-purple-500",
    endpoints: [
      {
        method: "PUT",
        path: "/api/api-accounts/webhook-config",
        description:
          "Configure webhook URL and subscribe to events. Returns webhookSecret once — store it securely.",
        body: [
          {
            name: "webhookUrl",
            type: "string",
            required: true,
            description: "HTTPS endpoint on your server",
          },
          {
            name: "events",
            type: "string[]",
            required: true,
            description: "Array of event names to subscribe",
          },
        ],
        response: `{
  "success": true,
  "data": {
    "webhookUrl": "https://tsangphoolhonda.com/api/scanfleet-webhook",
    "webhookSecret": "a3f9...8b2c",
    "events": ["wallet.balance_updated", "order.bound"]
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Configure",
            code: `// Run once during initial setup
const res = await fetch(\`\${BASE_URL}/api/api-accounts/webhook-config\`, {
  method: 'PUT',
  headers: {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    webhookUrl: 'https://tsangphoolhonda.com/api/scanfleet-webhook',
    events: [
      'wallet.balance_updated',
      'order.bound',
      'order.shipped',
      'order.delivered',
    ],
  }),
});

const { data } = await res.json();
// ⚠️  Save data.webhookSecret in your env — shown only once
process.env.SCANFLEET_WEBHOOK_SECRET = data.webhookSecret;`,
          },
          {
            lang: "node",
            label: "Receiver",
            code: `import crypto from 'crypto';
import express from 'express';

const router = express.Router();
const SECRET = process.env.SCANFLEET_WEBHOOK_SECRET;

router.post(
  '/api/scanfleet-webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig       = req.headers['x-scanfleet-signature'];
    const timestamp = req.headers['x-scanfleet-timestamp'];
    const event     = req.headers['x-scanfleet-event'];
    const body      = req.body.toString();

    // 1 — Verify HMAC signature
    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(body)
      .digest('hex');

    if (sig !== expected) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2 — Replay attack prevention (5-min window)
    if (Date.now() - new Date(timestamp).getTime() > 5 * 60_000) {
      return res.status(400).json({ error: 'Expired webhook' });
    }

    const payload = JSON.parse(body);

    // 3 — Handle events
    switch (event) {
      case 'wallet.balance_updated':
        updateInventoryCache(payload.data.newBalance);
        break;
      case 'order.bound':
        markOrderComplete(payload.data);
        break;
    }

    res.status(200).send('OK');
  }
);`,
          },
        ],
      },
    ],
  },
  {
    id: "passkeys",
    label: "Passkeys",
    icon: Shield,
    color: "from-yellow-500 to-orange-500",
    endpoints: [
      {
        method: "POST",
        path: "/api/external/v1/passkeys",
        description:
          "Generate a passkey to authorize salesmen to process orders using the dealer wallet.",
        body: [
          {
            name: "label",
            type: "string",
            required: true,
            description: "Descriptive label for the passkey",
          },
          {
            name: "expiresInDays",
            type: "number",
            required: false,
            description: "Expiry days (default: 30)",
          },
        ],
        response: `{
  "success": true,
  "data": {
    "code": "PK-A1B2C3D4E5",
    "label": "Showroom Floor Salesman",
    "expiresAt": "2025-03-17T00:00:00.000Z"
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `const res = await fetch(\`\${BASE_URL}/api/external/v1/passkeys\`, {
  method: 'POST',
  headers: {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    label: 'Showroom Floor Salesman',
    expiresInDays: 30,
  }),
});
const { data } = await res.json();
console.log(data.code); // PK-A1B2C3D4E5`,
          },
        ],
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    endpoints: [
      {
        method: "GET",
        path: "/api/external/v1/salesmen",
        description: "List linked salesmen with usage statistics.",
        response: `{
  "success": true,
  "data": {
    "salesmen": [
      {
        "id": "673xyz...",
        "name": "Rahul Sharma",
        "email": "rahul@tsangphool.com",
        "ordersProcessed": 12,
        "linkedAt": "2024-01-10T00:00:00.000Z"
      }
    ]
  }
}`,
        codes: [
          {
            lang: "node",
            label: "Node.js",
            code: `const res  = await fetch(\`\${BASE_URL}/api/external/v1/salesmen\`, {
  headers: { Authorization: authHeader }
});
const { data } = await res.json();
console.log(data.salesmen);`,
          },
        ],
      },
    ],
  },
];

const WEBHOOK_EVENTS = [
  {
    event: "wallet.balance_updated",
    description: "Token balance changed (purchase or consumption)",
  },
  {
    event: "order.bound",
    description: "Attach code successfully bound to customer data",
  },
  {
    event: "order.processing",
    description: "Order picked up for manufacturing",
  },
  { event: "order.shipped", description: "Physical sticker dispatched" },
  { event: "order.delivered", description: "Delivery confirmed" },
  { event: "token.purchased", description: "New tokens added via Razorpay" },
  { event: "passkey.created", description: "New salesman passkey generated" },
  { event: "passkey.used", description: "Passkey activated by a salesman" },
  { event: "webhook.test", description: "Fired by the test endpoint" },
];

const ERROR_CODES = [
  {
    code: "401",
    label: "Unauthorized",
    description: "Invalid credentials or IP not whitelisted",
  },
  {
    code: "403",
    label: "Forbidden",
    description: "Account suspended or wrong role",
  },
  { code: "404", label: "Not Found", description: "Resource not found" },
  {
    code: "429",
    label: "Rate Limited",
    description: "2000 req/hr or 20000 req/day exceeded",
  },
  {
    code: "400",
    label: "Bad Request",
    description: "Invalid or missing request parameters",
  },
  {
    code: "500",
    label: "Server Error",
    description: "Internal error — retry with exponential backoff",
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  POST: "bg-green-500/20 text-green-300 border border-green-500/30",
  PUT: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  DELETE: "bg-red-500/20 text-red-300 border border-red-500/30",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className='p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white/80'
    >
      {copied ? (
        <Check size={14} className='text-green-400' />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className='relative bg-black/40 rounded-xl border border-white/10 overflow-hidden'>
      <div className='flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5'>
        <div className='flex items-center gap-2'>
          <Terminal size={12} className='text-cyan-400' />
          <span className='text-xs text-white/50 font-mono'>{label}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <pre className='p-4 text-xs text-white/80 overflow-x-auto leading-relaxed font-mono'>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParamTable({ params, title }: { params: Param[]; title: string }) {
  return (
    <div className='mt-4'>
      <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-2'>
        {title}
      </p>
      <div className='border border-white/10 rounded-xl overflow-hidden'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-white/5 border-b border-white/10'>
              <th className='text-left px-4 py-2.5 text-xs text-white/50 font-medium'>
                Name
              </th>
              <th className='text-left px-4 py-2.5 text-xs text-white/50 font-medium'>
                Type
              </th>
              <th className='text-left px-4 py-2.5 text-xs text-white/50 font-medium'>
                Required
              </th>
              <th className='text-left px-4 py-2.5 text-xs text-white/50 font-medium'>
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr
                key={p.name}
                className='border-b border-white/5 hover:bg-white/5 transition-colors'
              >
                <td className='px-4 py-3 font-mono text-xs text-cyan-300'>
                  {p.name}
                </td>
                <td className='px-4 py-3 font-mono text-xs text-purple-300'>
                  {p.type}
                </td>
                <td className='px-4 py-3'>
                  {p.required ? (
                    <span className='text-xs text-red-400'>required</span>
                  ) : (
                    <span className='text-xs text-white/30'>optional</span>
                  )}
                </td>
                <td className='px-4 py-3 text-xs text-white/60'>
                  {p.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className='w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group'
      >
        <div className='flex items-center gap-3'>
          <span
            className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md ${METHOD_COLORS[endpoint.method]}`}
          >
            {endpoint.method}
          </span>
          <span className='font-mono text-sm text-white/90'>
            {endpoint.path}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs text-white/40 hidden md:block'>
            {endpoint.description}
          </span>
          {open ? (
            <ChevronDown
              size={16}
              className='text-white/40 group-hover:text-white/70 transition-colors'
            />
          ) : (
            <ChevronRight
              size={16}
              className='text-white/40 group-hover:text-white/70 transition-colors'
            />
          )}
        </div>
      </button>

      {open && (
        <div className='border-t border-white/10 p-6 space-y-5'>
          <p className='text-sm text-white/60'>{endpoint.description}</p>

          {endpoint.params && (
            <ParamTable
              params={endpoint.params}
              title='Path / Query Parameters'
            />
          )}
          {endpoint.body && (
            <ParamTable params={endpoint.body} title='Request Body' />
          )}

          {/* Response */}
          <div>
            <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-2'>
              Response
            </p>
            <div className='relative bg-black/40 rounded-xl border border-white/10 overflow-hidden'>
              <div className='flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5'>
                <span className='text-xs text-white/50 font-mono'>JSON</span>
                <CopyButton text={endpoint.response} />
              </div>
              <pre className='p-4 text-xs text-green-300/80 overflow-x-auto leading-relaxed font-mono'>
                <code>{endpoint.response}</code>
              </pre>
            </div>
          </div>

          {/* Code Examples */}
          {endpoint.codes && endpoint.codes.length > 0 && (
            <div>
              <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-2'>
                Code Example
              </p>
              {endpoint.codes.length > 1 && (
                <div className='flex gap-2 mb-3'>
                  {endpoint.codes.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                        activeTab === i
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-white/40 hover:text-white/70 border border-white/10"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
              <CodeBlock
                code={endpoint.codes[activeTab]?.code ?? endpoint.codes[0].code}
                label={
                  endpoint.codes[activeTab]?.label ?? endpoint.codes[0].label
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState("auth");

  const currentSection =
    SECTIONS.find((s) => s.id === activeSection) ?? SECTIONS[0];

  return (
    <div className='min-h-screen bg-[#0a0a0f] text-white font-sans'>
      {/* Background */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/3 to-purple-500/3 rounded-full blur-3xl' />
      </div>

      {/* Top Nav */}
      <header className='fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='w-8 h-8 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <Zap size={16} className='text-white' />
              </div>
              <div className='absolute -inset-0.5 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg blur opacity-30' />
            </div>
            <span className='font-bold text-white'>ScanFleet</span>
            <span className='text-white/20 mx-1'>/</span>
            <span className='text-sm text-white/60'>API Reference</span>
          </div>

          <div className='flex items-center gap-3'>
            <span className='text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-mono'>
              v1
            </span>
            <a
              href='https://scanfleet.in'
              target='_blank'
              rel='noreferrer'
              className='text-sm text-white/50 hover:text-white/90 transition-colors flex items-center gap-1'
            >
              scanfleet.in <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      <div className='pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 min-h-screen'>
        {/* Sidebar */}
        <aside className='hidden lg:block w-56 shrink-0 py-10'>
          <div className='sticky top-24 space-y-1'>
            <p className='text-xs font-semibold text-white/30 uppercase tracking-widest mb-4 px-3'>
              Endpoints
            </p>
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = s.id === activeSection;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={14} className='text-white' />
                  </div>
                  {s.label}
                </button>
              );
            })}

            <div className='pt-4 border-t border-white/10 mt-4 space-y-1'>
              <p className='text-xs font-semibold text-white/30 uppercase tracking-widest mb-4 px-3'>
                Reference
              </p>
              {["Events", "Errors"].map((label) => (
                <button
                  key={label}
                  onClick={() => setActiveSection(label.toLowerCase())}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeSection === label.toLowerCase()
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <div className='w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0'>
                    {label === "Events" ? (
                      <BookOpen size={14} className='text-white/60' />
                    ) : (
                      <AlertCircle size={14} className='text-white/60' />
                    )}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 py-10 min-w-0'>
          {/* Hero */}
          {activeSection === "auth" && (
            <div className='mb-10 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-8'>
              <h1 className='text-2xl font-bold text-white mb-2'>
                ScanFleet External API
              </h1>
              <p className='text-white/60 mb-6 max-w-2xl'>
                Integrate ScanFleet's vehicle safety platform directly into your
                dealership website. Manage tokens, bind customer data to QR
                stickers, and receive real-time webhook notifications.
              </p>

              {/* Quick Setup */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='bg-black/30 rounded-xl border border-white/10 p-5'>
                  <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2'>
                    <Key size={12} className='text-cyan-400' /> Base URL
                  </p>
                  <code className='text-sm text-cyan-300 font-mono'>
                    https://api.scanfleet.in
                  </code>
                </div>
                <div className='bg-black/30 rounded-xl border border-white/10 p-5'>
                  <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2'>
                    <Shield size={12} className='text-cyan-400' />{" "}
                    Authentication
                  </p>
                  <code className='text-sm text-cyan-300 font-mono'>
                    Authorization: Basic base64(key:secret)
                  </code>
                </div>
                <div className='bg-black/30 rounded-xl border border-white/10 p-5'>
                  <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2'>
                    <Zap size={12} className='text-cyan-400' /> Rate Limits
                  </p>
                  <p className='text-sm text-white/70'>
                    2,000 req/hr · 20,000 req/day
                  </p>
                </div>
                <div className='bg-black/30 rounded-xl border border-white/10 p-5'>
                  <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2'>
                    <CheckCircle2 size={12} className='text-cyan-400' /> Role
                  </p>
                  <p className='text-sm text-white/70'>
                    Requires{" "}
                    <code className='text-cyan-300'>DEALERSHIP_OWNER</code>{" "}
                    account
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Header */}
          {currentSection &&
            activeSection !== "events" &&
            activeSection !== "errors" && (
              <>
                <div className='flex items-center gap-3 mb-6'>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentSection.color} flex items-center justify-center`}
                  >
                    <currentSection.icon size={20} className='text-white' />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-white'>
                      {currentSection.label}
                    </h2>
                    <p className='text-sm text-white/40'>
                      {currentSection.endpoints.length} endpoint
                      {currentSection.endpoints.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  {currentSection.endpoints.map((ep, i) => (
                    <EndpointCard key={i} endpoint={ep} />
                  ))}
                </div>
              </>
            )}

          {/* Webhook Events */}
          {activeSection === "events" && (
            <>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center'>
                  <BookOpen size={20} className='text-white' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-white'>
                    Webhook Events
                  </h2>
                  <p className='text-sm text-white/40'>
                    All subscribable events
                  </p>
                </div>
              </div>

              <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-white/5 border-b border-white/10'>
                      <th className='text-left px-6 py-3 text-xs text-white/40 font-semibold uppercase tracking-wider'>
                        Event
                      </th>
                      <th className='text-left px-6 py-3 text-xs text-white/40 font-semibold uppercase tracking-wider'>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEBHOOK_EVENTS.map((e) => (
                      <tr
                        key={e.event}
                        className='border-b border-white/5 hover:bg-white/5 transition-colors'
                      >
                        <td className='px-6 py-4'>
                          <code className='text-xs text-cyan-300 font-mono bg-cyan-500/10 px-2 py-1 rounded-md'>
                            {e.event}
                          </code>
                        </td>
                        <td className='px-6 py-4 text-sm text-white/60'>
                          {e.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Error Codes */}
          {activeSection === "errors" && (
            <>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center'>
                  <AlertCircle size={20} className='text-white' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-white'>Error Codes</h2>
                  <p className='text-sm text-white/40'>HTTP status reference</p>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                {ERROR_CODES.map((e) => (
                  <div
                    key={e.code}
                    className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex gap-4'
                  >
                    <span className='text-2xl font-bold font-mono text-white/20'>
                      {e.code}
                    </span>
                    <div>
                      <p className='font-semibold text-white text-sm'>
                        {e.label}
                      </p>
                      <p className='text-xs text-white/50 mt-1'>
                        {e.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Mobile nav */}
          <div className='lg:hidden mt-10 pt-8 border-t border-white/10'>
            <p className='text-xs text-white/30 mb-4'>Jump to section</p>
            <div className='flex flex-wrap gap-2'>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    activeSection === s.id
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-white/10 text-white/50 hover:text-white/80"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiDocs;
