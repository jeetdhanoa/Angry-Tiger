"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import { rupees } from "@/lib/cart";
import {
  createProduct,
  deleteProduct,
  listAllProducts,
  updateProduct,
  type AdminProduct,
  type NewProduct,
} from "@/lib/admin";

const CATEGORIES = ["clothing", "posters", "books", "discs", "objects"];

type FormState = {
  name: string;
  slug: string;
  price: string;
  category: string;
  tag: string;
  sizes: string;
  description: string;
};

const EMPTY: FormState = {
  name: "",
  slug: "",
  price: "",
  category: "clothing",
  tag: "",
  sizes: "",
  description: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function toPayload(f: FormState): NewProduct | string {
  const name = f.name.trim();
  const price = parseInt(f.price, 10);
  if (!name) return "Name it first.";
  if (!Number.isFinite(price) || price <= 0) return "Price needs to be a number of rupees.";
  return {
    name,
    slug: f.slug.trim() || slugify(name),
    price,
    category: f.category,
    tag: f.tag.trim(),
    sizes: f.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    description: f.description.trim(),
    sold_out: false,
    active: true,
  };
}

function toForm(p: AdminProduct): FormState {
  return {
    name: p.name,
    slug: p.slug,
    price: String(p.price),
    category: p.category,
    tag: p.tag,
    sizes: p.sizes.join(", "),
    description: p.description,
  };
}

function ProductForm({
  form,
  setForm,
  onSave,
  onCancel,
  busy,
  error,
  saveLabel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSave: () => void;
  onCancel?: () => void;
  busy: boolean;
  error: string;
  saveLabel: string;
}) {
  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value });

  return (
    <div className="acct-form acct-form--wide">
      <div className="acct-form__row">
        <label className="field">
          <span>Name</span>
          <input className="input-dark" placeholder="The tiger tee." value={form.name} onChange={set("name")} />
        </label>
        <label className="field">
          <span>Slug (blank = from name)</span>
          <input className="input-dark" placeholder="tiger-tee" value={form.slug} onChange={set("slug")} />
        </label>
      </div>
      <div className="acct-form__row">
        <label className="field">
          <span>Price (₹)</span>
          <input className="input-dark" inputMode="numeric" placeholder="1499" value={form.price} onChange={set("price")} />
        </label>
        <label className="field">
          <span>Category</span>
          <select className="input-dark" value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="acct-form__row">
        <label className="field">
          <span>Tag</span>
          <input className="input-dark" placeholder="Drop 002 · Pre-order" value={form.tag} onChange={set("tag")} />
        </label>
        <label className="field">
          <span>Sizes (comma-separated, blank = none)</span>
          <input className="input-dark" placeholder="S, M, L, XL" value={form.sizes} onChange={set("sizes")} />
        </label>
      </div>
      <label className="field">
        <span>Description</span>
        <textarea className="input-dark" rows={3} placeholder="What it is, why it matters." value={form.description} onChange={set("description")} />
      </label>
      <div className="acct-form__actions">
        <Button variant="primary" size="md" onClick={onSave} disabled={busy}>
          {busy ? "Saving…" : saveLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => listAllProducts().then(setProducts), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = async (id?: string) => {
    const payload = toPayload(form);
    if (typeof payload === "string") {
      setError(payload);
      return;
    }
    setError("");
    setBusy(true);
    // Edits keep the current visibility flags; creates start live.
    const err = id
      ? await updateProduct(id, {
          name: payload.name,
          slug: payload.slug,
          price: payload.price,
          category: payload.category,
          tag: payload.tag,
          sizes: payload.sizes,
          description: payload.description,
        })
      : await createProduct(payload);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setForm(EMPTY);
    setAdding(false);
    setEditing(null);
    refresh();
  };

  const toggle = async (p: AdminProduct, patch: Partial<NewProduct>) => {
    await updateProduct(p.id, patch);
    refresh();
  };

  const remove = async (p: AdminProduct) => {
    if (!window.confirm(`Take "${p.name}" off the shelf for good? Carts holding it empty out.`))
      return;
    await deleteProduct(p.id);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Products</h2>
      {products === null ? null : (
        <>
          {products.length > 0 && (
            <div className="acct-rows">
              {products.map((p) =>
                editing === p.id ? (
                  <div key={p.id} className="adm-prod adm-prod--editing">
                    <ProductForm
                      form={form}
                      setForm={setForm}
                      onSave={() => save(p.id)}
                      onCancel={() => setEditing(null)}
                      busy={busy}
                      error={error}
                      saveLabel="Save changes"
                    />
                  </div>
                ) : (
                  <div key={p.id} className="adm-prod">
                    <div className="adm-prod__head">
                      <span className="adm-prod__name">{p.name}</span>
                      <span className="adm-prod__price">{rupees(p.price)}</span>
                    </div>
                    <div className="adm-prod__meta">
                      <span>
                        {p.category} · {p.tag || "no tag"} · {p.sizes.length ? p.sizes.join("/") : "no sizes"} · /{p.slug}
                      </span>
                      {p.sold_out && <span className="adm-badge">Sold out</span>}
                      {!p.active && <span className="adm-badge adm-badge--muted">Hidden</span>}
                    </div>
                    <div className="addr-card__actions">
                      <button
                        type="button"
                        className="addr-card__action"
                        onClick={() => {
                          setForm(toForm(p));
                          setEditing(p.id);
                          setAdding(false);
                          setError("");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="addr-card__action"
                        onClick={() => toggle(p, { sold_out: !p.sold_out })}
                      >
                        {p.sold_out ? "Back in stock" : "Mark sold out"}
                      </button>
                      <button
                        type="button"
                        className="addr-card__action"
                        onClick={() => toggle(p, { active: !p.active })}
                      >
                        {p.active ? "Hide from shop" : "Put on the shelf"}
                      </button>
                      <button
                        type="button"
                        className="addr-card__action addr-card__action--danger"
                        onClick={() => remove(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {products.length === 0 && !adding && (
            <div className="acct-empty">
              <p className="acct-empty__title">The shelf is empty.</p>
              <p className="acct-empty__sub">Add the first drop.</p>
            </div>
          )}
          {adding ? (
            <ProductForm
              form={form}
              setForm={setForm}
              onSave={() => save()}
              onCancel={() => setAdding(false)}
              busy={busy}
              error={error}
              saveLabel="Add product"
            />
          ) : (
            !editing && (
              <Button
                variant="secondary"
                size="md"
                style={{ alignSelf: "flex-start" }}
                onClick={() => {
                  setForm(EMPTY);
                  setAdding(true);
                  setError("");
                }}
              >
                Add a product
              </Button>
            )
          )}
        </>
      )}
    </div>
  );
}
