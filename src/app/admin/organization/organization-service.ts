import { supabase } from '@/integrations/supabase/client';
import type { OrgLevel, OrgMember, UpsertOrgLevel, UpsertOrgMember } from './types';

export const organizationService = {
  async getLevels(): Promise<OrgLevel[]> {
    const { data, error } = await supabase
      .from('org_levels')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as OrgLevel[];
  },

  async getMembersByLevel(levelId: string): Promise<OrgMember[]> {
    const { data, error } = await supabase
      .from('org_members')
      .select('*')
      .eq('level_id', levelId)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as OrgMember[];
  },

  async getOrCreateLevelByName(name: string, order_index = 1): Promise<OrgLevel> {
    const { data, error } = await supabase
      .from('org_levels')
      .select('*')
      .eq('name', name)
      .maybeSingle();
    if (error) throw error;
    if (data) return data as OrgLevel;
    const { data: created, error: upErr } = await supabase
      .from('org_levels')
      .insert({ name, order_index })
      .select('*')
      .single();
    if (upErr) throw upErr;
    return created as OrgLevel;
  },

  async getHeadmasterLevel(): Promise<OrgLevel> {
    return this.getOrCreateLevelByName('Kepala Sekolah', 1);
  },

  async upsertLevel(payload: UpsertOrgLevel): Promise<OrgLevel> {
    const { data, error } = await supabase
      .from('org_levels')
      .upsert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data as OrgLevel;
  },

  async deleteLevel(id: string) {
    const { error } = await supabase.from('org_levels').delete().eq('id', id);
    if (error) throw error;
  },

  async upsertMember(payload: UpsertOrgMember): Promise<OrgMember> {
    const { data, error } = await supabase
      .from('org_members')
      .upsert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data as OrgMember;
  },

  async deleteMember(id: string) {
    const { error } = await supabase.from('org_members').delete().eq('id', id);
    if (error) throw error;
  },

  async listHeadmasters(): Promise<OrgMember[]> {
    const level = await this.getHeadmasterLevel();
    return this.getMembersByLevel(level.id);
  },

  async setActiveHeadmaster(memberId: string): Promise<void> {
    // Find member to get level_id
    const { data: member, error: mErr } = await supabase
      .from('org_members')
      .select('id, level_id')
      .eq('id', memberId)
      .single();
    if (mErr) throw mErr;
    const levelId = (member as Pick<OrgMember, 'id' | 'level_id'>).level_id;
    // Deactivate others in the same level
    const { error: offErr } = await supabase
      .from('org_members')
      .update({ is_active: false })
      .eq('level_id', levelId);
    if (offErr) throw offErr;
    // Activate target
    const { error: onErr } = await supabase
      .from('org_members')
      .update({ is_active: true })
      .eq('id', memberId);
    if (onErr) throw onErr;
  },

  async upsertHeadmaster(payload: Omit<UpsertOrgMember, 'level_id'> & { level_id?: string }): Promise<OrgMember> {
    const level = payload.level_id ? { id: payload.level_id } as OrgLevel : await this.getHeadmasterLevel();
    const saved = await this.upsertMember({
      ...payload,
      level_id: level.id,
      is_active: payload.is_active ?? true,
    });
    if (saved.is_active) {
      await this.setActiveHeadmaster(saved.id);
    }
    return saved;
  }
};
