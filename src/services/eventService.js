import { supabase } from '../lib/supabaseClient';

export const eventService = {
    // 사용자 이벤트 조회
    async getUserEvents(userId) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('creator_id', userId)
            .order('event_datetime', { ascending: false });

        if (error) throw error;
        return data;
    },

    // 이벤트 생성
    async createEvent(eventData) {
        const { data, error } = await supabase.from('events').insert([eventData]).select().single();

        if (error) throw error;
        return data;
    },

    // 이벤트 수정
    async updateEvent(eventId, eventData) {
        const { data, error } = await supabase.from('events').update(eventData).eq('id', eventId).select().single();

        if (error) throw error;
        return data;
    },

    // 이벤트 삭제
    async deleteEvent(eventId) {
        const { error } = await supabase.from('events').delete().eq('id', eventId);

        if (error) throw error;
    },

    // 이벤트 조회수 증가
    async incrementEventView(eventId) {
        const { error } = await supabase.rpc('increment_event_view', {
            event_id: eventId,
        });

        if (error) throw error;
    },
};
