import redisClient from '../../redis';
import supabase from "../../supabaseClient";


/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  
  const factoryId = 'JVL'

  let { data: resources} = await supabase.from('resources').select('*').order('flowOrder', { ascending: true }).order('name', { ascending: true });
  let { data: jobs } = await supabase.from('jobs').select('*')
  let { data: dependencies } = await supabase.from('dependencies').select('*')
  
  const redisValue = await redisClient.get('jvl.ganttData');

  return {
    factoryId: factoryId ?? null,
    ganttData: redisValue ? JSON.parse(redisValue) : {},
    resources: resources ?? [],
    jobs: jobs ?? [],
    dependencies: dependencies ?? []
  };
  
}
