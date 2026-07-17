import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { formatDate } from '../lib/utils';

interface Participant {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  attended: boolean;
  createdAt: string;
}

export const ParticipantsList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      const [pRes, eRes] = await Promise.all([
        fetch(`/api/registrations/event/${eventId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      const pData = await pRes.json();
      const eData = await eRes.json();
      
      setParticipants(pData);
      setEvent(eData);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const markAttendance = async (registrationId: string) => {
    try {
      const res = await fetch('/api/registrations/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ registrationId })
      });
      if (res.ok) {
        setParticipants(prev => prev.map(p => 
          p._id === registrationId ? { ...p, attended: true } : p
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center">Loading participants...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{event?.title}</h1>
          <p className="text-zinc-400">Participant list and attendance management</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-sm">
        <div className="border-b border-white/[0.04] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Participants ({participants.length})</h2>
            <div className="flex gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-500" />
                {participants.filter(p => p.attended).length} Attended
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={14} className="text-zinc-300" />
                {participants.filter(p => !p.attended).length} Pending
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/[0.05]/40 text-zinc-400">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Registration Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {participants.map((p) => (
                <tr key={p._id} className="hover:bg-white/[0.05]/40/50">
                  <td className="px-6 py-4 font-medium">{p.user.name}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {p.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    {p.attended ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle2 size={12} />
                        Attended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!p.attended && (
                      <Button size="sm" onClick={() => markAttendance(p._id)}>
                        Mark Attended
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    No participants registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
