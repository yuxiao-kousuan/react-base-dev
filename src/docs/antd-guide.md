# Ant Design 使用指南

## 📦 安装完成

Ant Design 已成功安装并配置到项目中！

## 🎯 已配置的功能

### 1. 基础安装
- ✅ `antd` 核心库
- ✅ TypeScript 类型支持（内置）
- ✅ 全局样式导入
- ✅ 自定义主题配置

### 2. 样式配置
- ✅ 导入 `antd/dist/reset.css` 重置样式
- ✅ 自定义主题色彩（主色调：#4f46e5）
- ✅ 组件样式优化
- ✅ 响应式设计支持

### 3. 演示页面
- ✅ 创建了 `/antd-demo` 路由
- ✅ 包含常用组件演示
- ✅ 图标使用示例
- ✅ 布局组件展示

## 🚀 使用方法

### 基础导入
```tsx
import { Button, Card, Space, Typography } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
```

### 常用组件示例

#### 按钮组件
```tsx
import { Button } from 'antd';

<Button type="primary">主要按钮</Button>
<Button>默认按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="link">链接按钮</Button>
```

#### 图标使用
```tsx
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

<Button icon={<UserOutlined />}>用户</Button>
<Button icon={<SettingOutlined />}>设置</Button>
```

#### 布局组件
```tsx
import { Row, Col, Card, Space } from 'antd';

<Row gutter={[16, 16]}>
  <Col span={12}>
    <Card title="卡片标题">
      卡片内容
    </Card>
  </Col>
  <Col span={12}>
    <Card title="另一个卡片">
      另一个卡片内容
    </Card>
  </Col>
</Row>
```

#### 表单组件
```tsx
import { Input, Select, DatePicker } from 'antd';

<Input placeholder="请输入内容" />
<Select placeholder="请选择">
  <Option value="option1">选项1</Option>
  <Option value="option2">选项2</Option>
</Select>
<DatePicker placeholder="选择日期" />
```

## 🎨 主题定制

### 自定义色彩
项目已配置了自定义主题色彩：
- 主色调：`#4f46e5`
- 悬停色：`#4338ca`
- 激活色：`#3730a3`

### 样式覆盖
可以通过 `src/assets/styles/antd-custom.css` 文件自定义组件样式。

## 📱 响应式设计

Ant Design 内置了响应式设计支持：
- 栅格系统：`Row` 和 `Col` 组件
- 断点：`xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- 移动端适配：自动调整组件大小

## 🔧 高级配置

### 按需加载（推荐）
```tsx
// 只导入需要的组件，减少打包体积
import Button from 'antd/es/button';
import Card from 'antd/es/card';
```

### 主题定制
```tsx
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#4f46e5',
    },
  }}
>
  <App />
</ConfigProvider>
```

## 📚 常用组件列表

### 基础组件
- Button 按钮
- Icon 图标
- Typography 排版
- Divider 分割线

### 布局组件
- Layout 布局
- Grid 栅格
- Space 间距
- Card 卡片

### 导航组件
- Menu 菜单
- Breadcrumb 面包屑
- Pagination 分页
- Steps 步骤条

### 数据录入
- Form 表单
- Input 输入框
- Select 选择器
- DatePicker 日期选择器
- Upload 上传

### 数据展示
- Table 表格
- List 列表
- Descriptions 描述列表
- Statistic 统计数值
- Progress 进度条

### 反馈组件
- Alert 警告提示
- Message 全局提示
- Modal 对话框
- Drawer 抽屉
- Popconfirm 气泡确认框

## 🌟 最佳实践

1. **按需导入**：只导入需要的组件
2. **主题统一**：使用统一的设计语言
3. **响应式**：考虑不同屏幕尺寸
4. **无障碍**：注意可访问性
5. **性能优化**：合理使用懒加载

## 🔗 相关链接

- [Ant Design 官方文档](https://ant.design/)
- [Ant Design 组件库](https://ant.design/components/overview-cn)
- [Ant Design 图标库](https://ant.design/components/icon-cn)
- [Ant Design 主题定制](https://ant.design/docs/react/customize-theme-cn)

现在您可以在项目中自由使用 Ant Design 组件了！访问 `/antd-demo` 页面查看组件演示。
