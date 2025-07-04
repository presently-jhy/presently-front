import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useSupabaseRealtime = (table, filter = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // 초기 데이터 로드
        const fetchData = async () => {
            try {
                let query = supabase.from(table).select('*');

                if (filter) {
                    query = query.eq(filter.column, filter.value);
                }

                const { data: initialData, error } = await query;

                if (error) throw error;
                setData(initialData || []);
            } catch (error) {
                console.error(`Error fetching ${table}:`, error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Realtime 구독 설정 (선택적)
        const subscription = supabase
            .channel(`${table}_changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table,
                    filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
                },
                (payload) => {
                    console.log('Realtime change:', payload);

                    switch (payload.eventType) {
                        case 'INSERT':
                            setData((prev) => [...prev, payload.new]);
                            break;
                        case 'UPDATE':
                            setData((prev) => prev.map((item) => (item.id === payload.new.id ? payload.new : item)));
                            break;
                        case 'DELETE':
                            setData((prev) => prev.filter((item) => item.id !== payload.old.id));
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [table, filter, user]);

    return { data, loading, error };
};
