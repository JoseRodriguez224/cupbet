function PreviewFrame({ url, live, children }) {
  return (
    <div className="preview">
      <div className="preview__toolbar">
        <span className="preview__dot preview__dot--red" />
        <span className="preview__dot preview__dot--yellow" />
        <span className="preview__dot preview__dot--green" />
        <span className="preview__url">{url}</span>
        {live && <span className="preview__live">● LIVE</span>}
      </div>
      <div className="preview__body">{children}</div>
    </div>
  );
}

function StatGrid({ items }) {
  return (
    <div className="preview-stats">
      {items.map((item) => (
        <div key={item.label} className="preview-stat">
          <span className="preview-stat__value">{item.value}</span>
          <span className="preview-stat__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export const previewSlides = {
  "portal-dashboard": () => (
    <PreviewFrame url="portal.client-api.io/dashboard">
      <div className="preview__body preview__body--split">
        <aside className="preview-sidebar">
          {["Overview", "API Services", "Integrations", "Documents"].map((item, i) => (
            <div key={item} className={`preview-sidebar__item ${i === 0 ? "preview-sidebar__item--active" : ""}`}>{item}</div>
          ))}
        </aside>
        <div className="preview-main">
          <StatGrid items={[{ value: "99.9%", label: "Uptime" }, { value: "12", label: "Services" }, { value: "120ms", label: "Avg Response" }]} />
          <div className="preview-table">
            <div className="preview-table__row preview-table__row--head"><span>Service</span><span>Status</span><span>Req/min</span></div>
            {[["Auth API", "Healthy", "842"], ["Document API", "Healthy", "1,204"], ["Integration Hub", "Healthy", "567"]].map(([a, b, c]) => (
              <div key={a} className="preview-table__row"><span>{a}</span><span className="preview-badge preview-badge--green">{b}</span><span>{c}</span></div>
            ))}
          </div>
        </div>
      </div>
    </PreviewFrame>
  ),

  "portal-api": () => (
    <PreviewFrame url="portal.client-api.io/api-services">
      <StatGrid items={[{ value: "48", label: "Endpoints" }, { value: "3", label: "Versions" }, { value: "0", label: "Errors" }]} />
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Endpoint</span><span>Method</span><span>Latency</span></div>
        {[["/api/v2/clients", "GET", "45ms"], ["/api/v2/documents", "POST", "82ms"], ["/api/v2/integrations", "PUT", "67ms"], ["/api/v2/auth/token", "POST", "31ms"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span className="preview-badge preview-badge--blue">{b}</span><span>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "portal-integrations": () => (
    <PreviewFrame url="portal.client-api.io/integrations">
      {["Salesforce CRM", "Azure AD", "SharePoint", "SAP ERP"].map((name, i) => (
        <div key={name} className="preview-sync">
          <div className="preview-sync__header"><span>{name}</span><span className="preview-badge preview-badge--green">Connected</span></div>
          <div className="preview-sync__bar"><div className="preview-sync__fill" style={{ width: `${100 - i * 8}%` }} /></div>
          <span className="preview-sync__count">Last sync: {i + 1} min ago</span>
        </div>
      ))}
    </PreviewFrame>
  ),

  "portal-monitoring": () => (
    <PreviewFrame url="portal.client-api.io/monitoring" live>
      <StatGrid items={[{ value: "0", label: "Incidents" }, { value: "2.1M", label: "Requests/day" }, { value: "99.9%", label: "SLA" }]} />
      <div className="preview-chart">
        {[55, 70, 45, 85, 60, 90, 75, 80, 65, 92, 78, 88].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "portal-users": () => (
    <PreviewFrame url="portal.client-api.io/users">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>User</span><span>Role</span><span>Status</span></div>
        {[["J. Rodriguez", "Admin", "Active"], ["S. Chen", "Developer", "Active"], ["M. Patel", "Viewer", "Active"], ["A. Kim", "Developer", "Invited"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span className={`preview-badge ${c === "Active" ? "preview-badge--green" : "preview-badge--yellow"}`}>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "ai-pipeline": () => (
    <PreviewFrame url="workflow.ai-engine.io/pipeline">
      <div className="preview-pipeline">
        {[{ step: "Document Intake", status: "done", count: "847" }, { step: "AI Validation", status: "active", count: "812" }, { step: "Classification", status: "pending", count: "—" }, { step: "Route & Deliver", status: "pending", count: "—" }].map((item, i) => (
          <div key={item.step} className="preview-pipeline__step">
            <div className={`preview-pipeline__node preview-pipeline__node--${item.status}`}>{item.status === "done" ? "✓" : i + 1}</div>
            <div className="preview-pipeline__info"><span className="preview-pipeline__name">{item.step}</span><span className="preview-pipeline__count">{item.count} docs</span></div>
          </div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "ai-queue": () => (
    <PreviewFrame url="workflow.ai-engine.io/queue">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Document</span><span>Stage</span><span>Priority</span></div>
        {[["contract_v2.pdf", "Validation", "High"], ["invoice_8841.pdf", "Intake", "Normal"], ["form_w4.docx", "Classification", "Normal"], ["report_q1.xlsx", "Intake", "Low"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span className={`preview-badge ${c === "High" ? "preview-badge--yellow" : "preview-badge--blue"}`}>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "ai-review": () => (
    <PreviewFrame url="workflow.ai-engine.io/review">
      <div className="preview-ai-result__card" style={{ marginBottom: "0.75rem" }}>
        <span>invoice_Q4_2025.pdf</span>
        <span className="preview-badge preview-badge--blue">Invoice · 96.2%</span>
      </div>
      <StatGrid items={[{ value: "96.2%", label: "Confidence" }, { value: "12", label: "Fields extracted" }, { value: "Pass", label: "Validation" }]} />
      <div className="preview-doc"><span className="preview-doc__icon">✓</span><div className="preview-doc__info"><span className="preview-doc__name">Amount: $14,820.00</span><span className="preview-doc__meta">Vendor: Acme Corp · Due: Jan 15</span></div></div>
    </PreviewFrame>
  ),

  "ai-analytics": () => (
    <PreviewFrame url="workflow.ai-engine.io/analytics">
      <StatGrid items={[{ value: "2,400", label: "Docs / day" }, { value: "96.2%", label: "Accuracy" }, { value: "85%", label: "Auto-routed" }]} />
      <div className="preview-chart">
        {[60, 72, 68, 80, 75, 88, 82, 90, 85, 92, 88, 96].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "ai-logs": () => (
    <PreviewFrame url="workflow.ai-engine.io/logs">
      {["14:32:01 — Document classified: invoice_march.pdf", "14:31:58 — Validation passed: contract_v2.pdf", "14:31:44 — Intake complete: form_w4.docx", "14:31:30 — Routed to Finance: report_q1.xlsx", "14:31:12 — Pipeline started: batch #8841"].map((log) => (
        <div key={log} className="preview-doc" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}><span className="preview-doc__icon">›</span><div className="preview-doc__info"><span className="preview-doc__name" style={{ fontSize: "0.62rem" }}>{log}</span></div></div>
      ))}
    </PreviewFrame>
  ),

  "saas-tenants": () => (
    <PreviewFrame url="admin.saas-platform.io/tenants">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Tenant</span><span>Plan</span><span>Users</span><span>Status</span></div>
        {[["Acme Corp", "Enterprise", "124", "Active"], ["NovaTech", "Pro", "48", "Active"], ["BlueLine", "Pro", "31", "Active"], ["Summit LLC", "Starter", "8", "Provisioning"]].map(([a, b, c, d]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span>{c}</span><span className={`preview-badge ${d === "Active" ? "preview-badge--green" : "preview-badge--yellow"}`}>{d}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "saas-roles": () => (
    <PreviewFrame url="admin.saas-platform.io/roles">
      {["Super Admin", "Tenant Admin", "Editor", "Viewer", "Billing", "Support"].map((role) => (
        <div key={role} className="preview-doc"><span className="preview-doc__icon">🔑</span><div className="preview-doc__info"><span className="preview-doc__name">{role}</span><span className="preview-doc__meta">{role === "Super Admin" ? "Full access" : "Scoped permissions"}</span></div><span className="preview-badge preview-badge--green">Active</span></div>
      ))}
    </PreviewFrame>
  ),

  "saas-billing": () => (
    <PreviewFrame url="admin.saas-platform.io/billing">
      <StatGrid items={[{ value: "$48K", label: "MRR" }, { value: "48", label: "Tenants" }, { value: "12%", label: "Growth" }]} />
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Plan</span><span>Price</span><span>Tenants</span></div>
        {[["Enterprise", "$999/mo", "8"], ["Pro", "$299/mo", "22"], ["Starter", "$49/mo", "18"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "saas-audit": () => (
    <PreviewFrame url="admin.saas-platform.io/audit">
      {["Tenant created: Summit LLC", "Role updated: Editor permissions", "User invited: dev@novatech.com", "Plan upgraded: BlueLine → Pro", "API key rotated: Acme Corp"].map((e) => (
        <div key={e} className="preview-doc"><span className="preview-doc__icon">📋</span><div className="preview-doc__info"><span className="preview-doc__name">{e}</span><span className="preview-doc__meta">Today · by system</span></div></div>
      ))}
    </PreviewFrame>
  ),

  "saas-onboarding": () => (
    <PreviewFrame url="admin.saas-platform.io/onboarding">
      <div className="preview-pipeline">
        {[{ step: "Company Info", status: "done" }, { step: "Select Plan", status: "done" }, { step: "Configure SSO", status: "active" }, { step: "Invite Users", status: "pending" }].map((item, i) => (
          <div key={item.step} className="preview-pipeline__step">
            <div className={`preview-pipeline__node preview-pipeline__node--${item.status}`}>{item.status === "done" ? "✓" : i + 1}</div>
            <div className="preview-pipeline__info"><span className="preview-pipeline__name">{item.step}</span></div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "0.75rem" }}>Estimated completion: 2 hours</p>
    </PreviewFrame>
  ),

  "dashboard-live": () => (
    <PreviewFrame url="ops.live-dashboard.io" live>
      <StatGrid items={[{ value: "$48.2K", label: "Revenue Today" }, { value: "1,847", label: "Active Orders" }, { value: "98.4%", label: "Fulfillment" }]} />
      <div className="preview-chart">
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "dashboard-orders": () => (
    <PreviewFrame url="ops.live-dashboard.io/orders" live>
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Order</span><span>Customer</span><span>Status</span></div>
        {[["#ORD-8841", "Acme Inc", "Shipped"], ["#ORD-8842", "NovaTech", "Processing"], ["#ORD-8843", "BlueLine", "Delivered"], ["#ORD-8844", "Summit LLC", "Pending"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span className={`preview-badge ${c === "Delivered" ? "preview-badge--green" : "preview-badge--blue"}`}>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "dashboard-alerts": () => (
    <PreviewFrame url="ops.live-dashboard.io/alerts" live>
      {[{ msg: "High order volume — Region West", type: "yellow" }, { msg: "All fulfillment targets met", type: "green" }, { msg: "Inventory low: SKU-4421", type: "yellow" }, { msg: "SignalR connection stable", type: "green" }].map((a) => (
        <div key={a.msg} className="preview-doc"><span className="preview-doc__icon">⚡</span><div className="preview-doc__info"><span className="preview-doc__name">{a.msg}</span><span className="preview-doc__meta">Just now</span></div><span className={`preview-badge preview-badge--${a.type}`}>{a.type === "green" ? "OK" : "Warn"}</span></div>
      ))}
    </PreviewFrame>
  ),

  "dashboard-regions": () => (
    <PreviewFrame url="ops.live-dashboard.io/regions" live>
      <StatGrid items={[{ value: "West", label: "Top Region" }, { value: "842", label: "Orders/hr" }, { value: "+12%", label: "vs Yesterday" }]} />
      <div className="preview-chart">
        {[90, 75, 60, 85, 70, 95, 80].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "dashboard-reports": () => (
    <PreviewFrame url="ops.live-dashboard.io/reports">
      {["Daily Revenue Summary", "Fulfillment Performance", "Regional Breakdown", "Customer Satisfaction"].map((r) => (
        <div key={r} className="preview-doc"><span className="preview-doc__icon">📊</span><div className="preview-doc__info"><span className="preview-doc__name">{r}</span><span className="preview-doc__meta">PDF · Ready to export</span></div><span className="preview-badge preview-badge--blue">Export</span></div>
      ))}
    </PreviewFrame>
  ),

  "healthcare-patients": () => (
    <PreviewFrame url="care.tateeda-health.io/patients">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Patient ID</span><span>Care Plan</span><span>Status</span></div>
        {[["PT-10482", "Diabetes Mgmt", "Active"], ["PT-10491", "Post-Op Recovery", "Active"], ["PT-10503", "Cardiac Care", "Review"], ["PT-10517", "Preventive", "Active"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span className={`preview-badge ${c === "Active" ? "preview-badge--green" : "preview-badge--yellow"}`}>{c}</span></div>
        ))}
      </div>
      <div className="preview-hipaa">🔒 HIPAA-compliant · All access logged</div>
    </PreviewFrame>
  ),

  "healthcare-careplan": () => (
    <PreviewFrame url="care.tateeda-health.io/care-plan">
      <StatGrid items={[{ value: "PT-10482", label: "Patient" }, { value: "Diabetes", label: "Condition" }, { value: "Active", label: "Plan Status" }]} />
      {["Daily glucose monitoring", "Medication adherence check", "Nutrition counseling — Week 3", "Follow-up appointment: Jul 2"].map((t) => (
        <div key={t} className="preview-doc"><span className="preview-doc__icon">✓</span><div className="preview-doc__info"><span className="preview-doc__name">{t}</span></div></div>
      ))}
    </PreviewFrame>
  ),

  "healthcare-vitals": () => (
    <PreviewFrame url="care.tateeda-health.io/vitals">
      <StatGrid items={[{ value: "118/76", label: "Blood Pressure" }, { value: "98.4°F", label: "Temperature" }, { value: "72 bpm", label: "Heart Rate" }]} />
      <div className="preview-chart">
        {[50, 55, 52, 58, 54, 60, 57, 62, 59, 65, 61, 58].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "healthcare-messages": () => (
    <PreviewFrame url="care.tateeda-health.io/messages">
      {[{ from: "Dr. Martinez", msg: "Lab results reviewed — all normal", time: "2h ago" }, { from: "Care Team", msg: "Reminder: appointment tomorrow", time: "5h ago" }, { from: "Patient Portal", msg: "Medication refill approved", time: "1d ago" }].map((m) => (
        <div key={m.msg} className="preview-doc"><span className="preview-doc__icon">💬</span><div className="preview-doc__info"><span className="preview-doc__name">{m.from}</span><span className="preview-doc__meta">{m.msg} · {m.time}</span></div></div>
      ))}
      <div className="preview-hipaa">🔒 Encrypted messaging</div>
    </PreviewFrame>
  ),

  "healthcare-audit": () => (
    <PreviewFrame url="care.tateeda-health.io/audit">
      {["PHI accessed: PT-10482 by Dr. Martinez", "Care plan updated: PT-10491", "Login: nurse@clinic.org", "Export blocked: unauthorized role", "Record viewed: PT-10503"].map((e) => (
        <div key={e} className="preview-doc"><span className="preview-doc__icon">🔒</span><div className="preview-doc__info"><span className="preview-doc__name" style={{ fontSize: "0.62rem" }}>{e}</span><span className="preview-doc__meta">Logged · HIPAA audit trail</span></div></div>
      ))}
    </PreviewFrame>
  ),

  "integration-sync": () => (
    <PreviewFrame url="hub.tateeda-health.io/sync">
      {[{ name: "Epic EHR", synced: "1,204 records", status: "Synced" }, { name: "Billing Provider", synced: "892 records", status: "Synced" }, { name: "Lab Data Feed", synced: "347 records", status: "Syncing" }].map((sys) => (
        <div key={sys.name} className="preview-sync">
          <div className="preview-sync__header"><span>{sys.name}</span><span className={`preview-badge ${sys.status === "Synced" ? "preview-badge--green" : "preview-badge--blue"}`}>{sys.status}</span></div>
          <div className="preview-sync__bar"><div className="preview-sync__fill" style={{ width: sys.status === "Synced" ? "100%" : "67%" }} /></div>
          <span className="preview-sync__count">{sys.synced} today</span>
        </div>
      ))}
    </PreviewFrame>
  ),

  "integration-mapping": () => (
    <PreviewFrame url="hub.tateeda-health.io/mapping">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Source Field</span><span>Target Field</span><span>Match</span></div>
        {[["patient_id", "PatientID", "100%"], ["dob", "DateOfBirth", "100%"], ["insurance_code", "PayerID", "98%"], ["diagnosis", "ICD10Code", "95%"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span className="preview-badge preview-badge--green">{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "integration-errors": () => (
    <PreviewFrame url="hub.tateeda-health.io/errors">
      {[{ err: "Timeout: Lab Data Feed", status: "Resolved" }, { err: "Mapping mismatch: PayerID", status: "Retrying" }, { err: "Duplicate record skipped", status: "Handled" }].map((e) => (
        <div key={e.err} className="preview-doc"><span className="preview-doc__icon">⚠</span><div className="preview-doc__info"><span className="preview-doc__name">{e.err}</span><span className="preview-doc__meta">Auto-recovery enabled</span></div><span className={`preview-badge ${e.status === "Resolved" ? "preview-badge--green" : "preview-badge--yellow"}`}>{e.status}</span></div>
      ))}
    </PreviewFrame>
  ),

  "integration-schedule": () => (
    <PreviewFrame url="hub.tateeda-health.io/schedule">
      {["Epic EHR — Every 15 min", "Billing Provider — Hourly", "Lab Data Feed — Every 30 min", "Nightly full sync — 2:00 AM"].map((s) => (
        <div key={s} className="preview-doc"><span className="preview-doc__icon">⏱</span><div className="preview-doc__info"><span className="preview-doc__name">{s}</span><span className="preview-doc__meta">Next run scheduled</span></div><span className="preview-badge preview-badge--green">Active</span></div>
      ))}
    </PreviewFrame>
  ),

  "integration-history": () => (
    <PreviewFrame url="hub.tateeda-health.io/history">
      <StatGrid items={[{ value: "1,200+", label: "Syncs / day" }, { value: "99.7%", label: "Success rate" }, { value: "3", label: "Systems" }]} />
      <div className="preview-chart">
        {[95, 98, 97, 99, 96, 100, 98, 99, 97, 100, 99, 100].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "analytics-forecast": () => (
    <PreviewFrame url="analytics.forecast.io/predictions">
      <StatGrid items={[{ value: "91%", label: "Forecast Accuracy" }, { value: "-34%", label: "Overstock" }]} />
      <div className="preview-forecast">
        <div className="preview-forecast__legend">
          <span><i className="preview-forecast__dot preview-forecast__dot--actual" /> Actual</span>
          <span><i className="preview-forecast__dot preview-forecast__dot--predicted" /> Predicted</span>
        </div>
        <svg viewBox="0 0 300 80" className="preview-forecast__svg">
          <polyline fill="none" stroke="rgba(20,184,166,0.5)" strokeWidth="2" points="0,60 50,55 100,45 150,50 200,35 250,40 300,25" />
          <polyline fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 3" points="150,50 200,30 250,35 300,20" />
        </svg>
      </div>
    </PreviewFrame>
  ),

  "analytics-models": () => (
    <PreviewFrame url="analytics.forecast.io/models">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>Model</span><span>Accuracy</span><span>Status</span></div>
        {[["Sales Forecast v3", "91%", "Production"], ["Demand Predict v2", "88%", "Production"], ["Seasonal Adjust v1", "85%", "Staging"], ["Regional Split v2", "89%", "Production"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span>{b}</span><span className={`preview-badge ${c === "Production" ? "preview-badge--green" : "preview-badge--yellow"}`}>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "analytics-regions": () => (
    <PreviewFrame url="analytics.forecast.io/regions">
      <StatGrid items={[{ value: "West", label: "Top Region" }, { value: "+18%", label: "Growth" }, { value: "4", label: "Regions" }]} />
      <div className="preview-chart">
        {[80, 65, 90, 72].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%`, flex: 2 }} />
        ))}
      </div>
    </PreviewFrame>
  ),

  "analytics-inventory": () => (
    <PreviewFrame url="analytics.forecast.io/inventory">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>SKU</span><span>Stock</span><span>Forecast</span></div>
        {[["SKU-4421", "Low", "Reorder"], ["SKU-8840", "OK", "Stable"], ["SKU-1102", "High", "Reduce"], ["SKU-3391", "OK", "Stable"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span className={`preview-badge ${b === "Low" ? "preview-badge--yellow" : "preview-badge--green"}`}>{b}</span><span>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "analytics-reports": () => (
    <PreviewFrame url="analytics.forecast.io/reports">
      {["Weekly Sales Forecast", "Inventory Optimization", "Regional Performance", "Model Accuracy Report"].map((r) => (
        <div key={r} className="preview-doc"><span className="preview-doc__icon">📈</span><div className="preview-doc__info"><span className="preview-doc__name">{r}</span><span className="preview-doc__meta">Generated · PDF ready</span></div><span className="preview-badge preview-badge--blue">Download</span></div>
      ))}
    </PreviewFrame>
  ),

  "classification-results": () => (
    <PreviewFrame url="docs.ai-classifier.io/results">
      {[["contract_2024_v3.pdf", "Legal", "97.1%"], ["invoice_march.pdf", "Invoice", "94.5%"], ["employee_form.docx", "HR", "92.8%"], ["report_Q1.xlsx", "Financial", "96.3%"]].map(([a, b, c]) => (
        <div key={a} className="preview-doc"><span className="preview-doc__icon">📄</span><div className="preview-doc__info"><span className="preview-doc__name">{a}</span><span className="preview-doc__meta">{b} · {c} confidence</span></div><span className="preview-badge preview-badge--green">Routed</span></div>
      ))}
    </PreviewFrame>
  ),

  "classification-upload": () => (
    <PreviewFrame url="docs.ai-classifier.io/upload">
      <div style={{ border: "2px dashed rgba(20,184,166,0.4)", borderRadius: "8px", padding: "2rem", textAlign: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.5rem" }}>📁</span>
        <p style={{ fontSize: "0.7rem", color: "#e2e8f0", margin: "0.5rem 0 0" }}>Drop files here or click to upload</p>
        <p style={{ fontSize: "0.58rem", color: "#94a3b8", margin: "0.25rem 0 0" }}>PDF, DOCX, XLSX supported</p>
      </div>
      <StatGrid items={[{ value: "847", label: "Queued" }, { value: "900+", label: "Today" }, { value: "94.5%", label: "Accuracy" }]} />
    </PreviewFrame>
  ),

  "classification-rules": () => (
    <PreviewFrame url="docs.ai-classifier.io/rules">
      {["Invoice → Finance dept", "Legal → Legal team", "HR → Human Resources", "Financial → Accounting"].map((r) => (
        <div key={r} className="preview-doc"><span className="preview-doc__icon">⚙</span><div className="preview-doc__info"><span className="preview-doc__name">{r}</span><span className="preview-doc__meta">NLP rule · Active</span></div><span className="preview-badge preview-badge--green">On</span></div>
      ))}
    </PreviewFrame>
  ),

  "classification-queue": () => (
    <PreviewFrame url="docs.ai-classifier.io/queue">
      <div className="preview-table">
        <div className="preview-table__row preview-table__row--head"><span>File</span><span>Progress</span><span>ETA</span></div>
        {[["batch_8841.zip", "Processing", "12s"], ["scan_0042.pdf", "OCR", "8s"], ["forms_jan.docx", "Queued", "—"], ["report.xlsx", "Done", "✓"]].map(([a, b, c]) => (
          <div key={a} className="preview-table__row"><span>{a}</span><span className="preview-badge preview-badge--blue">{b}</span><span>{c}</span></div>
        ))}
      </div>
    </PreviewFrame>
  ),

  "classification-stats": () => (
    <PreviewFrame url="docs.ai-classifier.io/stats">
      <StatGrid items={[{ value: "94.5%", label: "Accuracy" }, { value: "72%", label: "Time saved" }, { value: "900+", label: "Docs/day" }]} />
      <div className="preview-chart">
        {[88, 90, 91, 92, 93, 94, 93, 95, 94, 96, 95, 94].map((h, i) => (
          <div key={i} className="preview-chart__bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </PreviewFrame>
  ),
};

export default function ProjectPreview({ slideId }) {
  const render = previewSlides[slideId];
  if (!render) {
    return <div className="preview preview--fallback">Preview not available</div>;
  }
  return render();
}
