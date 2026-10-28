import React, { useState } from 'react';
import { PERMISSIONS, ROLES, TEAM, type Role, type TeamMember } from '../data';
import { Button, CMS_ASSETS, PageHeader } from '../ui';
import { cn } from '../cn';

const RolePill: React.FC<{ role: Role }> = ({ role }) => (
  <span
    className={cn(
      'inline-flex rounded-full px-[10px] py-[4px] cms-caps',
      role === 'Admin' ? 'bg-cms-ink text-white' : 'border border-cms-line py-[4px] text-cms-ink',
    )}
  >
    {role}
  </span>
);

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(TEAM);
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite] = useState({ email: '', role: 'Writer' as Role });

  const setRole = (email: string, role: Role) => setMembers((m) => m.map((x) => (x.email === email ? { ...x, role } : x)));

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite.email.trim()) return;
    const name = invite.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    setMembers((m) => [...m, { name, email: invite.email.trim(), role: invite.role, lastActive: 'Invited' }]);
    setInvite({ email: '', role: 'Writer' });
    setInviting(false);
  };

  return (
    <div className="flex flex-col gap-[28px]">
      <PageHeader
        title="Team & roles"
        subtitle={`${members.length} members`}
        actions={<Button onClick={() => setInviting((v) => !v)}>{inviting ? 'Cancel' : 'Invite member'}</Button>}
      />

      {inviting && (
        <form onSubmit={sendInvite} className="flex flex-wrap items-end gap-[12px] border border-cms-line p-[20px] animate-in">
          <label className="flex min-w-[240px] flex-1 flex-col gap-[8px]">
            <span className="cms-caps text-cms-muted">Email</span>
            <input
              type="email"
              required
              autoFocus
              value={invite.email}
              onChange={(e) => setInvite((s) => ({ ...s, email: e.target.value }))}
              className="cms-body border border-cms-line px-[14px] py-[12px] outline-none focus:border-cms-ink"
            />
          </label>
          <label className="flex flex-col gap-[8px]">
            <span className="cms-caps text-cms-muted">Role</span>
            <select
              value={invite.role}
              onChange={(e) => setInvite((s) => ({ ...s, role: e.target.value as Role }))}
              className="cms-body border border-cms-line bg-white px-[14px] py-[12px] outline-none focus:border-cms-ink"
            >
              <option>Writer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </label>
          <Button type="submit" className="py-[14px]">Send invite</Button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="cms-caps border-b border-cms-ink text-cms-muted">
              <th className="px-[12px] py-[10px] font-medium">Name</th>
              <th className="w-[316px] px-[8px] py-[10px] font-medium">Email</th>
              <th className="w-[156px] px-[8px] py-[10px] font-medium">Role</th>
              <th className="w-[156px] px-[8px] py-[10px] font-medium">Last active</th>
              <th className="w-[112px] py-[10px] pl-[8px] pr-[12px] font-medium"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email} className="border-b border-cms-line">
                <td className="px-[12px] py-[16px]">
                  <span className="flex items-center gap-[12px]">
                    <img src={CMS_ASSETS.avatar32} width={32} height={32} alt="" />
                    <span className="cms-nav whitespace-nowrap">{m.name}</span>
                  </span>
                </td>
                <td className="cms-body px-[8px] py-[16px] text-cms-muted">{m.email}</td>
                <td className="px-[8px] py-[16px]"><RolePill role={m.role} /></td>
                <td className="cms-body px-[8px] py-[16px] text-cms-muted">{m.lastActive}</td>
                <td className="cms-body py-[16px] pl-[8px] pr-[12px] text-cms-muted">
                  {m.lastActive === 'Now' ? (
                    '—'
                  ) : (
                    <span className="relative inline-flex">
                      <span aria-hidden>Edit ▾</span>
                      <select
                        aria-label={`Change role for ${m.name}`}
                        value={m.role}
                        onChange={(e) => {
                          if (e.target.value === 'Remove') setMembers((all) => all.filter((x) => x.email !== m.email));
                          else setRole(m.email, e.target.value as Role);
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      >
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Writer</option>
                        <option value="Remove">Remove from team</option>
                      </select>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-[6px] pt-[16px]">
        <h2 className="cms-nav">What each role can do</h2>
        <p className="cms-body text-cms-muted">Writers draft and submit. Editors and Admins review and publish.</p>
      </div>

      <div className="grid gap-[16px] md:grid-cols-3">
        {ROLES.map((r) => (
          <section key={r.role} className="flex flex-col gap-[16px] border border-cms-line p-[20px]">
            <h3 className="cms-display-s">{r.role}</h3>
            <p className="cms-body text-cms-muted">{r.blurb}</p>
            <ul className="flex flex-col gap-[16px]">
              {PERMISSIONS.map((perm, i) => (
                <li key={perm} className="flex items-center gap-[12px] border-t border-cms-line pt-[10px]">
                  <span aria-hidden className={cn('cms-nav', r.can[i] ? 'text-cms-ink' : 'text-cms-stone-3')}>{r.can[i] ? '✓' : '—'}</span>
                  <span className={cn('cms-body', r.can[i] ? 'text-cms-ink' : 'text-cms-muted')}>
                    <span className="sr-only">{r.can[i] ? 'Can: ' : 'Cannot: '}</span>{perm}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
