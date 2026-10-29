import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  Terminal
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface StatusCode {
  code: number;
  name: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  summary: string;
  rfc: string;
  rfcUrl: string;
  whenToUse: string;
  commonHeaders?: string[];
  expressSnippet: string;
}

const HTTP_CODES: StatusCode[] = [
  // 1xx Informational
  {
    code: 100,
    name: 'Continue',
    category: '1xx',
    summary: 'The server has received the request headers and the client should proceed to send the request body.',
    rfc: 'RFC 9110, 15.2.1',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.2.1',
    whenToUse: 'Large file uploads where the client sends Expect: 100-continue before sending massive body data.',
    expressSnippet: `res.status(100).end();`,
  },
  {
    code: 101,
    name: 'Switching Protocols',
    category: '1xx',
    summary: 'The requester has asked the server to switch protocols and the server has agreed to do so (e.g., HTTP to WebSocket).',
    rfc: 'RFC 9110, 15.2.2',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.2.2',
    whenToUse: 'WebSocket handshakes with Upgrade: websocket header.',
    commonHeaders: ['Upgrade: websocket', 'Connection: Upgrade'],
    expressSnippet: `// Handled automatically during WebSocket upgrade`,
  },

  // 2xx Success
  {
    code: 200,
    name: 'OK',
    category: '2xx',
    summary: 'Standard response for successful HTTP requests. Payload depends on the request method.',
    rfc: 'RFC 9110, 15.3.1',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.1',
    whenToUse: 'Returning successful GET queries, PUT updates, or general successful API responses.',
    expressSnippet: `res.status(200).json({ success: true, data: result });`,
  },
  {
    code: 201,
    name: 'Created',
    category: '2xx',
    summary: 'The request has succeeded and a new resource has been created as a result.',
    rfc: 'RFC 9110, 15.3.2',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.2',
    whenToUse: 'After successful POST requests creating new database records, users, or items.',
    commonHeaders: ['Location: /api/v1/users/usr_123'],
    expressSnippet: `res.status(201).location('/api/items/' + item.id).json(item);`,
  },
  {
    code: 202,
    name: 'Accepted',
    category: '2xx',
    summary: 'The request has been accepted for processing, but processing has not been completed yet.',
    rfc: 'RFC 9110, 15.3.3',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.3',
    whenToUse: 'Asynchronous background jobs, queue processing, or long batch exports.',
    expressSnippet: `res.status(202).json({ jobId: 'job_882', status: 'queued' });`,
  },
  {
    code: 204,
    name: 'No Content',
    category: '2xx',
    summary: 'The server successfully processed the request and is not returning any content in the body.',
    rfc: 'RFC 9110, 15.3.5',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.5',
    whenToUse: 'Successful DELETE requests or PUT updates where no payload needs to be returned.',
    expressSnippet: `res.status(204).send();`,
  },
  {
    code: 206,
    name: 'Partial Content',
    category: '2xx',
    summary: 'The server is delivering only part of the resource due to a Range header sent by the client.',
    rfc: 'RFC 9110, 15.3.7',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.7',
    whenToUse: 'Video streaming, audio seeking, and resumable file download chunks.',
    commonHeaders: ['Content-Range: bytes 0-1023/4096', 'Accept-Ranges: bytes'],
    expressSnippet: `res.status(206).set('Content-Range', \`bytes \${start}-\${end}/\${total}\`).send(chunk);`,
  },

  // 3xx Redirection
  {
    code: 301,
    name: 'Moved Permanently',
    category: '3xx',
    summary: 'This and all future requests should be directed to the given URI in the Location header.',
    rfc: 'RFC 9110, 15.4.2',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.2',
    whenToUse: 'Permanent domain migration, HTTP to HTTPS redirection, SEO canonical URL updates.',
    commonHeaders: ['Location: https://new-domain.com/path'],
    expressSnippet: `res.redirect(301, 'https://new-domain.com' + req.url);`,
  },
  {
    code: 302,
    name: 'Found (Temporary Redirect)',
    category: '3xx',
    summary: 'Tells the client to look at another URL temporarily, but future requests should still use the original URI.',
    rfc: 'RFC 9110, 15.4.3',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.3',
    whenToUse: 'Temporary maintenance redirects or login redirect flows.',
    commonHeaders: ['Location: /login'],
    expressSnippet: `res.redirect(302, '/login');`,
  },
  {
    code: 304,
    name: 'Not Modified',
    category: '3xx',
    summary: 'Indicates that the resource has not been modified since the version specified by If-Modified-Since or If-None-Match.',
    rfc: 'RFC 9110, 15.4.5',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.5',
    whenToUse: 'HTTP caching to save bandwidth when browser cached copy is still fresh.',
    commonHeaders: ['ETag: "686897696a7c876b7e"', 'Cache-Control: public, max-age=86400'],
    expressSnippet: `res.status(304).end();`,
  },
  {
    code: 307,
    name: 'Temporary Redirect (Method Preserved)',
    category: '3xx',
    summary: 'The request should be repeated with another URI; however, future requests should still use original URI. Method and body must NOT change.',
    rfc: 'RFC 9110, 15.4.8',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.8',
    whenToUse: 'Redirecting a POST/PUT request while guaranteeing that the client will NOT change the method to GET.',
    commonHeaders: ['Location: /v2/endpoint'],
    expressSnippet: `res.redirect(307, '/v2/endpoint');`,
  },
  {
    code: 308,
    name: 'Permanent Redirect (Method Preserved)',
    category: '3xx',
    summary: 'The target resource has been assigned a new permanent URI and method/body must not be altered.',
    rfc: 'RFC 9110, 15.4.9',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.9',
    whenToUse: 'Permanently migrating REST API endpoints without risking POST data being stripped into GET.',
    commonHeaders: ['Location: /v2/resource'],
    expressSnippet: `res.redirect(308, '/v2/resource');`,
  },

  // 4xx Client Error
  {
    code: 400,
    name: 'Bad Request',
    category: '4xx',
    summary: 'The server cannot or will not process the request due to perceived client error (e.g. malformed syntax, invalid JSON, missing parameters).',
    rfc: 'RFC 9110, 15.5.1',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1',
    whenToUse: 'Validation failures, missing mandatory payload fields, or malformed JSON payloads.',
    expressSnippet: `res.status(400).json({ error: 'Missing required parameter: email' });`,
  },
  {
    code: 401,
    name: 'Unauthorized',
    category: '4xx',
    summary: 'The client must authenticate itself to get the requested response. Lacks valid authentication credentials.',
    rfc: 'RFC 9110, 15.5.2',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.2',
    whenToUse: 'Expired JWT tokens, missing Bearer token, or failed login authentication.',
    commonHeaders: ['WWW-Authenticate: Bearer error="invalid_token"'],
    expressSnippet: `res.status(401).json({ error: 'Authentication token is expired or invalid' });`,
  },
  {
    code: 403,
    name: 'Forbidden',
    category: '4xx',
    summary: 'The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource.',
    rfc: 'RFC 9110, 15.5.4',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4',
    whenToUse: 'User is authenticated, but lacks permissions/roles (e.g. non-admin accessing admin portal).',
    expressSnippet: `res.status(403).json({ error: 'You do not have permission to delete this project' });`,
  },
  {
    code: 404,
    name: 'Not Found',
    category: '4xx',
    summary: 'The server cannot find the requested resource. Either the URL is not recognized or the entity does not exist in the database.',
    rfc: 'RFC 9110, 15.5.5',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.5',
    whenToUse: 'Requested user ID / document ID not found in database, or invalid route path.',
    expressSnippet: `res.status(404).json({ error: 'Resource not found' });`,
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    category: '4xx',
    summary: 'The request method is known by the server but is not supported by the target resource (e.g. GET allowed, but POST is sent).',
    rfc: 'RFC 9110, 15.5.6',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.6',
    whenToUse: 'When a route supports GET but a client attempts to POST or DELETE without route handler.',
    commonHeaders: ['Allow: GET, HEAD, OPTIONS'],
    expressSnippet: `res.status(405).set('Allow', 'GET').json({ error: 'POST method not allowed on this endpoint' });`,
  },
  {
    code: 408,
    name: 'Request Timeout',
    category: '4xx',
    summary: 'The server would like to shut down this unused connection because the client did not produce a request within the server timeout window.',
    rfc: 'RFC 9110, 15.5.9',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.9',
    whenToUse: 'Client socket idle timeout before sending full HTTP request.',
    expressSnippet: `res.status(408).json({ error: 'Request timed out' });`,
  },
  {
    code: 409,
    name: 'Conflict',
    category: '4xx',
    summary: 'The request could not be completed due to a conflict with the current state of the target resource (e.g. duplicate unique key).',
    rfc: 'RFC 9110, 15.5.10',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.10',
    whenToUse: 'Duplicate email registration, Git merge conflict, or optimistic lock version mismatch.',
    expressSnippet: `res.status(409).json({ error: 'A user with this email already exists' });`,
  },
  {
    code: 422,
    name: 'Unprocessable Content',
    category: '4xx',
    summary: 'The server understands the content type and syntax, but was unable to process the contained instructions due to semantic validation rules.',
    rfc: 'RFC 9110, 15.5.21',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.21',
    whenToUse: 'Form validation failure (e.g. password too short, age must be > 18, credit card expired).',
    expressSnippet: `res.status(422).json({ errors: [{ field: 'password', msg: 'Must be at least 8 chars' }] });`,
  },
  {
    code: 429,
    name: 'Too Many Requests (Rate Limited)',
    category: '4xx',
    summary: 'The user has sent too many requests in a given amount of time (rate limiting).',
    rfc: 'RFC 6585, Section 4',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc6585#section-4',
    whenToUse: 'API rate limits, brute-force login protection, IP throttling.',
    commonHeaders: ['Retry-After: 60', 'X-RateLimit-Limit: 100', 'X-RateLimit-Remaining: 0'],
    expressSnippet: `res.status(429).set('Retry-After', '60').json({ error: 'Rate limit exceeded. Try again in 60s' });`,
  },

  // 5xx Server Error
  {
    code: 500,
    name: 'Internal Server Error',
    category: '5xx',
    summary: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
    rfc: 'RFC 9110, 15.6.1',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1',
    whenToUse: 'Unhandled exceptions, database connection drops, crash in backend worker.',
    expressSnippet: `res.status(500).json({ error: 'Internal server error occurred' });`,
  },
  {
    code: 501,
    name: 'Not Implemented',
    category: '5xx',
    summary: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.',
    rfc: 'RFC 9110, 15.6.2',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.2',
    whenToUse: 'Endpoint stub during development before feature logic is completed.',
    expressSnippet: `res.status(501).json({ error: 'Feature not yet implemented' });`,
  },
  {
    code: 502,
    name: 'Bad Gateway',
    category: '5xx',
    summary: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
    rfc: 'RFC 9110, 15.6.3',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.3',
    whenToUse: 'Nginx, Cloudflare, or API gateway cannot reach upstream Node/Go backend container.',
    expressSnippet: `res.status(502).json({ error: 'Upstream microservice unresponsive' });`,
  },
  {
    code: 503,
    name: 'Service Unavailable',
    category: '5xx',
    summary: 'The server cannot handle the request (because it is overloaded or down for scheduled maintenance).',
    rfc: 'RFC 9110, 15.6.4',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.4',
    whenToUse: 'Scheduled maintenance windows, database migration, or server CPU throttling.',
    commonHeaders: ['Retry-After: 300'],
    expressSnippet: `res.status(503).set('Retry-After', '300').json({ error: 'Under maintenance' });`,
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    category: '5xx',
    summary: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
    rfc: 'RFC 9110, 15.6.5',
    rfcUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.5',
    whenToUse: 'Upstream query took longer than proxy timeout (e.g. 30s timeout on Cloudflare or Load Balancer).',
    expressSnippet: `res.status(504).json({ error: 'Gateway timeout waiting for upstream database' });`,
  },
];

export const HttpStatusCodes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const { addToast } = useToast();

  const filteredCodes = useMemo(() => {
    const q = search.toLowerCase().trim();
    return HTTP_CODES.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !q ||
        item.code.toString().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.whenToUse.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const handleCopy = (code: StatusCode) => {
    navigator.clipboard.writeText(code.expressSnippet);
    setCopiedCode(code.code);
    addToast(`Copied HTTP ${code.code} code snippet`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case '1xx': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case '2xx': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case '3xx': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case '4xx': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case '5xx': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Globe size={20} />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">HTTP Status Codes & Headers Reference</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                RFC 9110 Compliant
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Comprehensive encyclopedia of HTTP status codes (1xx - 5xx) with RFC documentation, standard response headers, best practices, and code snippets.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Codes' },
            { id: '1xx', label: '1xx Info' },
            { id: '2xx', label: '2xx Success' },
            { id: '3xx', label: '3xx Redirect' },
            { id: '4xx', label: '4xx Client Error' },
            { id: '5xx', label: '5xx Server Error' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, e.g. 404, rate limit, token..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Status Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCodes.map(item => (
          <div
            key={item.code}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-xl text-base font-black font-mono border ${getCategoryColor(item.category)}`}>
                    {item.code}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                    <a
                      href={item.rfcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono mt-0.5"
                    >
                      {item.rfc}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item)}
                  title="Copy Express.js code snippet"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  {copiedCode === item.code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {item.summary}
              </p>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">When to use:</span>
                <span className="text-slate-500 dark:text-slate-400">{item.whenToUse}</span>
              </div>

              {item.commonHeaders && item.commonHeaders.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400">Relevant Headers:</span>
                  {item.commonHeaders.map((hdr, hIdx) => (
                    <span key={hIdx} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] border border-slate-200 dark:border-slate-700">
                      {hdr}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Code Snippet */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <pre className="p-2.5 rounded-xl bg-[#090d16] text-cyan-200 font-mono text-[11px] overflow-x-auto">
                <code>{item.expressSnippet}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
