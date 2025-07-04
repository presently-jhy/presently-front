import { supabase } from '../lib/supabaseClient';

export const giftService = {
    // 이벤트별 선물 조회
    async getEventGifts(eventId) {
        const { data, error } = await supabase
            .from('gifts')
            .select(
                `
                *,
                feedbacks (*)
            `
            )
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // 선물 생성
    async createGift(giftData) {
        const { data, error } = await supabase.from('gifts').insert([giftData]).select().single();

        if (error) throw error;
        return data;
    },

    // 선물 상태 업데이트
    async updateGiftStatus(giftId, status) {
        const { data, error } = await supabase.from('gifts').update({ status }).eq('id', giftId).select().single();

        if (error) throw error;
        return data;
    },

    // 선물 삭제
    async deleteGift(giftId) {
        const { error } = await supabase.from('gifts').delete().eq('id', giftId);

        if (error) throw error;
    },

    // 펀딩 금액 업데이트
    async updateFundAmount(giftId, amount, targetAmount) {
        const percent = Math.round((amount / targetAmount) * 100);
        const { data, error } = await supabase
            .from('gifts')
            .update({
                current_amount: amount,
                percent: `${percent}%`,
            })
            .eq('id', giftId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 피드백 추가
    async addFeedback(giftId, feedbackData) {
        const { data, error } = await supabase
            .from('feedbacks')
            .insert([
                {
                    gift_id: giftId,
                    ...feedbackData,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 피드백 상태 업데이트
    async updateFeedbackStatus(feedbackId, status) {
        const { data, error } = await supabase
            .from('feedbacks')
            .update({ status })
            .eq('id', feedbackId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // localStorage와 Supabase 동기화
    async syncWithLocalStorage() {
        try {
            const localGifts = JSON.parse(localStorage.getItem('gifts')) || [];

            for (const localGift of localGifts) {
                // 이미 Supabase에 있는지 확인
                const { data: existingGift } = await supabase
                    .from('gifts')
                    .select('id')
                    .eq('local_id', localGift.id)
                    .single();

                if (!existingGift) {
                    // Supabase에 업로드
                    await this.createGift({
                        local_id: localGift.id,
                        event_id: localGift.eventId,
                        title: localGift.giftName,
                        description: localGift.giftDescription,
                        image_url: localGift.imageUrl,
                        gift_type: localGift.selectedType,
                        status: localGift.receiveStatus,
                        target_amount: localGift.targetAmount,
                        current_amount: localGift.currentAmount,
                        price: localGift.price,
                        link: localGift.link,
                    });
                }
            }

            // localStorage 정리
            localStorage.removeItem('gifts');
        } catch (error) {
            console.error('선물 데이터 동기화 실패:', error);
            throw error;
        }
    },

    // 하이브리드 모드: Supabase 실패 시 localStorage 사용
    async createGiftHybrid(giftData) {
        try {
            // 먼저 Supabase 시도
            return await this.createGift(giftData);
        } catch (error) {
            console.warn('Supabase 실패, localStorage 사용:', error);

            // localStorage에 저장
            const localGift = {
                id: Date.now(),
                ...giftData,
                created_at: new Date().toISOString(),
            };

            const existing = JSON.parse(localStorage.getItem('gifts')) || [];
            localStorage.setItem('gifts', JSON.stringify([...existing, localGift]));

            return localGift;
        }
    },
};
