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

                if (error) {
                    console.error(`Supabase query error for ${table}:`, error);
                    throw new Error('데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
                }
                setData(initialData || []);
            } catch (error) {
                console.error(`Error fetching ${table}:`, error);
                setError('데이터를 불러올 수 없습니다. 네트워크 연결을 확인해주세요.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Realtime 구독 설정
        const channel = supabase
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
                    console.log('Realtime update:', payload);
                    setData((currentData) => {
                        const newData = [...currentData];
                        const index = newData.findIndex((item) => item.id === payload.new?.id);

                        switch (payload.eventType) {
                            case 'INSERT':
                                if (payload.new) {
                                    newData.unshift(payload.new);
                                }
                                break;
                            case 'UPDATE':
                                if (payload.new && index !== -1) {
                                    newData[index] = payload.new;
                                }
                                break;
                            case 'DELETE':
                                if (index !== -1) {
                                    newData.splice(index, 1);
                                }
                                break;
                            default:
                                break;
                        }

                        return newData;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, table, filter]);

    return { data, loading, error };
};
