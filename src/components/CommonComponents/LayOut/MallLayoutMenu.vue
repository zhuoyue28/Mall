<template>
  <div class="h-full overflow-y-auto w-[256px] menuDiv">
    <a-menu v-model:selectedKeys="state.selectedKeys" style="width: 256px;" mode="inline" :open-keys="state.openKeys"
      :items="items" @openChange="onOpenChange" @click="handleClick"></a-menu>
  </div>
</template>
<script lang="ts" setup>
import { VueElement, h, reactive, ref } from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { ItemType } from 'ant-design-vue';
import router from '@/router';
import { menuList } from '@/request/api/menu/menu';

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const items = ref<ItemType[]>([]);

const setList = () => {
  menuList({}).then((res: any) => {
    let arr = res.data
    console.log(arr, 'setList');
    arr.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        let arr2 = item.children
        let arr3: any = []
        arr2.forEach((item2: any) => {
          arr3.push(getItem(item2.menu_name, item2.path))
        })
        items.value.push(getItem(item.menu_name, item.path, h(AppstoreOutlined), arr3))
        // items.value.push(getItem(item.menu_name, item.path, null, []))
      } else {
        items.value.push(getItem(item.menu_name, item.path, h(AppstoreOutlined)))
      }
    })
  })
}

setList()





const state = reactive({
  rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
  openKeys: ['sub1'],
  selectedKeys: [],
});
const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey: any = openKeys.find(key => state.openKeys.indexOf(key) === -1);
  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys;
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  }
};

const handleClick = (item: any, key: string, keyPath: string) => {

  console.log(item, key, keyPath);
  router.push({ path: item.key })

}

</script>


<style lang="less" scoped>
.menuDiv::-webkit-scrollbar {
  display: none !important;
}
</style>

