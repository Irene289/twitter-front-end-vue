import { apiHelper } from "../utils/helpers";

export default{
  follow({id}) {
    return apiHelper.post(`/followships`,{id})
  },
  unFollow({id}) {
    return apiHelper.delete(`/followships/${id}`)
  }
}