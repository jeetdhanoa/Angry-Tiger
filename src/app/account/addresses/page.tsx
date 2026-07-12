"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import {
  addAddress,
  listAddresses,
  removeAddress,
  setDefaultAddress,
  type Address,
  type NewAddress,
} from "@/lib/account";

const EMPTY: NewAddress = {
  label: "Home",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function AddressesSection() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<NewAddress>(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => listAddresses().then(setAddresses), []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const set = (key: keyof NewAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.pincode.trim()) {
      setError("Name, address, city and PIN are the minimum.");
      return;
    }
    setError("");
    setBusy(true);
    const err = await addAddress(user.id, form, addresses?.length === 0);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setForm(EMPTY);
    setAdding(false);
    refresh();
  };

  const makeDefault = async (id: string) => {
    if (!user) return;
    await setDefaultAddress(user.id, id);
    refresh();
  };

  const remove = async (id: string) => {
    await removeAddress(id);
    refresh();
  };

  return (
    <div className="acct-section">
      <h2 className="display acct-section__title">Addresses</h2>
      {addresses === null ? null : (
        <>
          {addresses.length === 0 && !adding && (
            <div className="acct-empty">
              <p className="acct-empty__title">No addresses yet.</p>
              <p className="acct-empty__sub">
                Add one now and checkout will already know where the drop goes.
              </p>
            </div>
          )}
          {addresses.length > 0 && (
            <div className="addr-grid">
              {addresses.map((a) => (
                <div key={a.id} className="addr-card">
                  <div className="addr-card__head">
                    <span className="caption-label">{a.label}</span>
                    {a.is_default && (
                      <span className="caption-label caption-label--white">Default</span>
                    )}
                  </div>
                  <p className="addr-card__body">
                    {a.name}
                    <br />
                    {a.line1}
                    {a.line2 && (
                      <>
                        <br />
                        {a.line2}
                      </>
                    )}
                    <br />
                    {a.city}
                    {a.state && `, ${a.state}`} {a.pincode}
                    {a.phone && (
                      <>
                        <br />
                        {a.phone}
                      </>
                    )}
                  </p>
                  <div className="addr-card__actions">
                    {!a.is_default && (
                      <button
                        type="button"
                        className="addr-card__action"
                        onClick={() => makeDefault(a.id)}
                      >
                        Make default
                      </button>
                    )}
                    <button
                      type="button"
                      className="addr-card__action addr-card__action--danger"
                      onClick={() => remove(a.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {adding ? (
            <form className="acct-form" onSubmit={save}>
              <div className="acct-form__row">
                <label className="field">
                  <span>Label</span>
                  <input className="input-dark" placeholder="Home" value={form.label} onChange={set("label")} />
                </label>
                <label className="field">
                  <span>Full name</span>
                  <input className="input-dark" placeholder="Your name" value={form.name} onChange={set("name")} />
                </label>
              </div>
              <label className="field">
                <span>Address line 1</span>
                <input className="input-dark" placeholder="House, street" value={form.line1} onChange={set("line1")} />
              </label>
              <label className="field">
                <span>Address line 2 (optional)</span>
                <input className="input-dark" placeholder="Area, landmark" value={form.line2} onChange={set("line2")} />
              </label>
              <div className="acct-form__row">
                <label className="field">
                  <span>City</span>
                  <input className="input-dark" placeholder="Mumbai" value={form.city} onChange={set("city")} />
                </label>
                <label className="field">
                  <span>State</span>
                  <input className="input-dark" placeholder="Maharashtra" value={form.state} onChange={set("state")} />
                </label>
              </div>
              <div className="acct-form__row">
                <label className="field">
                  <span>PIN code</span>
                  <input className="input-dark" placeholder="400001" value={form.pincode} onChange={set("pincode")} />
                </label>
                <label className="field">
                  <span>Phone (optional)</span>
                  <input className="input-dark" placeholder="+91" value={form.phone} onChange={set("phone")} />
                </label>
              </div>
              <div className="acct-form__actions">
                <Button type="submit" variant="primary" size="md" disabled={busy}>
                  {busy ? "Saving…" : "Save address"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setAdding(false)}
                >
                  Cancel
                </Button>
              </div>
              {error && (
                <span className="form-error" role="alert">
                  {error}
                </span>
              )}
            </form>
          ) : (
            <Button
              variant="secondary"
              size="md"
              style={{ alignSelf: "flex-start" }}
              onClick={() => setAdding(true)}
            >
              Add an address
            </Button>
          )}
        </>
      )}
    </div>
  );
}
