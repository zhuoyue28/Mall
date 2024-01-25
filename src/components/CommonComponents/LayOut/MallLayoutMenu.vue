<template>
  <div class="h-full overflow-y-auto w-[256px] menuDiv">
    <a-menu v-model:selectedKeys="state.selectedKeys" style="width: 256px;" mode="inline" :open-keys="state.openKeys"
      @openChange="onOpenChange" @click="handleClick">
      <template v-for="(item) in items" :key="item.key">
        <template v-if="!item.children || !item.children.length">
          <a-menu-item :key="item.key">
            <template #icon>
              <component v-if="item.icon && item.icon != '/'" :is="item.icon" />
            </template>
            <span style="font-weight: 500; font-size: 14px">{{ item.label }}</span>
          </a-menu-item>
        </template>
        <a-sub-menu :key="item.key" v-else>
          <template #icon>
            <component v-if="item.icon && item.icon != '/'" :is="item.icon" />
          </template>
          <template #title>
            <span style="font-weight: 500; font-size: 14px">{{ item.label }}</span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.key">
            <span style="font-weight: 500; font-size: 14px">{{ child.label }}</span>
          </a-menu-item>

        </a-sub-menu>
      </template>


    </a-menu>
  </div>
</template>
<script lang="ts" setup>
import { VueElement, reactive, ref } from 'vue';
// import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { ItemType } from 'ant-design-vue';
import router from '@/router';
import { roleFindUserMenu } from '@/request/api/menu/menu';
import { useRoute } from 'vue-router';

const route = useRoute();

console.log(route, '------------');
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



const items = ref<any[]>([]);

const setList = () => {
  roleFindUserMenu({}).then((res: any) => {
    let arr = res.data
    console.log(arr, 'setList');
    arr.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        let arr2 = item.children
        let arr3: any = []
        arr2.forEach((item2: any) => {
          if(item2.is_menu == '3' ) return
          arr3.push(getItem(item2.menu_name, item2.path))
        })
        items.value.push(getItem(item.menu_name, item.path, item.icon, arr3))
        // items.value.push(getItem(item.menu_name, item.path, null, []))
      } else {
        if(item.is_menu == '3' ) return
        items.value.push(getItem(item.menu_name, item.path, item.icon))
      }
    })
  })
}

setList()





const state = reactive<{ rootSubmenuKeys: string[], openKeys: string[], selectedKeys: string[] }>({
  rootSubmenuKeys: [],
  openKeys: [route.meta.Fpath + ''],
  selectedKeys: [route.path + ''],
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
  state.openKeys = [item.keyPath[0]];
  console.log(item, key, keyPath);
  router.push({ path: item.key })

}

</script>


<style lang="less" scoped>
.menuDiv::-webkit-scrollbar {
  display: none !important;
}
</style>

