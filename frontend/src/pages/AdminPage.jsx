import { useEffect, useState } from "react";
import { getDepartments, createDepartment, deleteDepartment } from "../api/departments";
import { getFaculty, createFaculty, deleteFaculty } from "../api/faculty";
import { getLabs, createLab, deleteLab } from "../api/labs";
import { registerUser } from "../api/auth";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { Trash2, Plus } from "lucide-react";

const TABS = ["Faculty", "Labs", "Departments", "Users"];

// ── helpers ────────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border border-hairline rounded-sm px-3 py-2 text-sm font-mono bg-paper focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full border border-hairline rounded-sm px-3 py-2 text-sm font-mono bg-paper focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
    >
      {children}
    </select>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm font-semibold bg-ink text-chalk rounded-sm px-4 py-2 hover:bg-ink-soft disabled:opacity-50 transition-colors"
    >
      <Plus size={14} />
      {loading ? "Saving…" : label}
    </button>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return <p className="text-brick-red text-xs mt-1">{msg}</p>;
}

function SuccessMsg({ msg }) {
  if (!msg) return null;
  return <p className="text-signal-green text-xs mt-1">{msg}</p>;
}

// ── Faculty tab ─────────────────────────────────────────────────────────────

function FacultyTab({ departments }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ facultyName: "", email: "", departmentId: "", cabinNumber: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    getFaculty().then(setList).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr(""); setOk("");
    try {
      const created = await createFaculty({ ...form, departmentId: Number(form.departmentId) });
      setList((l) => [...l, created]);
      setForm({ facultyName: "", email: "", departmentId: "", cabinNumber: "", phone: "" });
      setOk("Faculty profile created.");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this faculty profile?")) return;
    await deleteFaculty(id);
    setList((l) => l.filter((f) => f.facultyId !== id));
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="font-display text-base text-ink mb-4">Add faculty profile</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name"><Input required value={form.facultyName} onChange={f("facultyName")} placeholder="Dr. A. Ramesh" /></Field>
          <Field label="Email"><Input required type="email" value={form.email} onChange={f("email")} placeholder="ramesh@college.edu" /></Field>
          <Field label="Department">
            <Select required value={form.departmentId} onChange={f("departmentId")}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
            </Select>
          </Field>
          <Field label="Cabin number"><Input value={form.cabinNumber} onChange={f("cabinNumber")} placeholder="CSE-201" /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={f("phone")} placeholder="9840012345" /></Field>
          <div className="sm:col-span-2 flex items-center gap-4">
            <SubmitBtn loading={saving} label="Add faculty" />
            <ErrorMsg msg={err} />
            <SuccessMsg msg={ok} />
          </div>
        </form>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead className="border-b border-hairline bg-chalk">
            <tr>
              {["Name", "Email", "Department", "Cabin", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.facultyId} className="border-b border-hairline last:border-0 hover:bg-chalk/50">
                <td className="px-4 py-3 font-medium">{row.facultyName}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate">{row.email}</td>
                <td className="px-4 py-3 text-slate">{row.departmentName || "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.cabinNumber || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(row.facultyId)} className="text-slate hover:text-brick-red transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Labs tab ─────────────────────────────────────────────────────────────────

function LabsTab({ departments }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ labName: "", departmentId: "", capacity: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    getLabs().then(setList).finally(() => setLoading(false));
  }, []);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr(""); setOk("");
    try {
      const created = await createLab({ ...form, departmentId: Number(form.departmentId), capacity: Number(form.capacity) });
      setList((l) => [...l, created]);
      setForm({ labName: "", departmentId: "", capacity: "" });
      setOk("Lab created.");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this lab?")) return;
    await deleteLab(id);
    setList((l) => l.filter((x) => x.labId !== id));
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="font-display text-base text-ink mb-4">Add lab</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Lab name"><Input required value={form.labName} onChange={f("labName")} placeholder="Networks Lab" /></Field>
          <Field label="Department">
            <Select required value={form.departmentId} onChange={f("departmentId")}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
            </Select>
          </Field>
          <Field label="Capacity"><Input required type="number" min={1} value={form.capacity} onChange={f("capacity")} placeholder="40" /></Field>
          <div className="sm:col-span-3 flex items-center gap-4">
            <SubmitBtn loading={saving} label="Add lab" />
            <ErrorMsg msg={err} />
            <SuccessMsg msg={ok} />
          </div>
        </form>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead className="border-b border-hairline bg-chalk">
            <tr>
              {["Lab", "Department", "Capacity", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.labId} className="border-b border-hairline last:border-0 hover:bg-chalk/50">
                <td className="px-4 py-3 font-medium">{row.labName}</td>
                <td className="px-4 py-3 text-slate">{row.departmentName || "—"}</td>
                <td className="px-4 py-3 font-mono">{row.capacity}</td>
                <td className="px-4 py-3 text-slate">{row.status || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(row.labId)} className="text-slate hover:text-brick-red transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Departments tab ───────────────────────────────────────────────────────────

function DepartmentsTab({ departments, onDepartmentsChange }) {
  const [form, setForm] = useState({ departmentName: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr(""); setOk("");
    try {
      const created = await createDepartment(form);
      onDepartmentsChange([...departments, created]);
      setForm({ departmentName: "" });
      setOk("Department created.");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this department?")) return;
    await deleteDepartment(id);
    onDepartmentsChange(departments.filter((d) => d.departmentId !== id));
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="font-display text-base text-ink mb-4">Add department</h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <Field label="Department name">
              <Input required value={form.departmentName} onChange={(e) => setForm({ departmentName: e.target.value })} placeholder="Computer Science & Engineering" />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <SubmitBtn loading={saving} label="Add" />
            <ErrorMsg msg={err} />
            <SuccessMsg msg={ok} />
          </div>
        </form>
      </Card>

      <Card>
        <ul className="divide-y divide-hairline">
          {departments.map((d) => (
            <li key={d.departmentId} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm">{d.departmentName}</span>
              <button onClick={() => handleDelete(d.departmentId)} className="text-slate hover:text-brick-red transition-colors">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ── Users tab ─────────────────────────────────────────────────────────────────

const ROLES = ["FACULTY", "LAB_INCHARGE", "STUDENT", "ADMIN"];

function UsersTab() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "FACULTY" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr(""); setOk("");
    try {
      await registerUser(form);
      setForm({ name: "", email: "", password: "", role: "FACULTY" });
      setOk("Login created. They can sign in immediately.");
    } catch (ex) {
      setErr(ex.response?.data?.message || "Failed.");
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-lg">
      <Card className="p-6">
        <h3 className="font-display text-base text-ink mb-1">Create a login</h3>
        <p className="text-xs text-slate mb-5">Provision new accounts for faculty, lab incharges, students, or admins.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name"><Input required value={form.name} onChange={f("name")} placeholder="Dr. A. Ramesh" /></Field>
          <Field label="Email"><Input required type="email" value={form.email} onChange={f("email")} placeholder="ramesh@college.edu" /></Field>
          <Field label="Password"><Input required type="password" minLength={6} value={form.password} onChange={f("password")} placeholder="Min 6 characters" /></Field>
          <Field label="Role">
            <Select value={form.role} onChange={f("role")}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>
          <div className="flex items-center gap-4 pt-1">
            <SubmitBtn loading={saving} label="Create login" />
            <ErrorMsg msg={err} />
            <SuccessMsg msg={ok} />
          </div>
        </form>
      </Card>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Faculty");
  const [departments, setDepartments] = useState([]);
  const [depsLoading, setDepsLoading] = useState(true);

  useEffect(() => {
    getDepartments().then(setDepartments).finally(() => setDepsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Admin Panel</h1>
      <p className="text-sm text-slate mb-6">Manage faculty, labs, departments, and user logins.</p>

      <div className="flex gap-1 border-b border-hairline mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "border-ink text-ink"
                : "border-transparent text-slate hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {depsLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {activeTab === "Faculty" && <FacultyTab departments={departments} />}
          {activeTab === "Labs" && <LabsTab departments={departments} />}
          {activeTab === "Departments" && <DepartmentsTab departments={departments} onDepartmentsChange={setDepartments} />}
          {activeTab === "Users" && <UsersTab />}
        </>
      )}
    </div>
  );
}
