import { useState } from "react"
import {
  Settings,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Mock данные для карточек метрик
const metricsCards = [
  {
    id: "revenue",
    title: "Выручка",
    value: "1 580 000 ₽",
    trend: { type: "up", value: "+8.2%", text: "к прошлому периоду" },
  },
  {
    id: "margin",
    title: "Маржинальная прибыль",
    value: "342 000 ₽",
    trend: { type: "down", value: "-4.1%" },
  },
  {
    id: "buyout",
    title: "% выкупа",
    value: "86.5%",
    trend: { type: "neutral", value: "-0.3 п.п." },
  },
  {
    id: "avg-check",
    title: "Средний чек",
    value: "2 980 ₽",
    trend: { type: "up", value: "+3.2%" },
  },
  {
    id: "orders",
    title: "Заказы",
    value: "4 920",
    trend: { type: "up", value: "+5.0%" },
  },
  {
    id: "returns",
    title: "Возвраты (шт / ₽)",
    value: "310 / 426 000 ₽",
    trend: { type: "down", value: "-1.2%" },
  },
  {
    id: "advertising",
    title: "Расходы на РК",
    value: "192 500 ₽",
    trend: { type: "up", value: "+9.8%" },
  },
  {
    id: "roi",
    title: "ROI",
    value: "3.4",
    trend: { type: "down", value: "-0.2" },
  },
]

// Типы данных для товаров
interface ProductGeneralReport {
  metric: string
  value: string
  comment: string
}

interface ExtendedStatsRow {
  metric: string
  values: number[]
}

interface ProductData {
  article: string
  // Основные метрики для главной таблицы
  revenue: string
  margin: string
  buyoutPercent: string
  ctr: string
  crCartPurchase: string
  change: { type: "up" | "down" | "neutral"; value: string; text?: string }
  // Детальная информация
  generalReport: ProductGeneralReport[]
  extendedStatsAPK: {
    columns: string[]
    data: ExtendedStatsRow[]
  }
  extendedStatsSearch: {
    columns: string[]
    data: ExtendedStatsRow[]
  }
}

// Mock данные для товаров с привязанными метриками
const productsData: ProductData[] = [
  {
    article: "370240817",
    revenue: "182 000 Р",
    margin: "48 600 Р",
    buyoutPercent: "89.2%",
    ctr: "1.8%",
    crCartPurchase: "52%",
    change: { type: "down", value: "-12%", text: "к неделе" },
    generalReport: [
      { metric: "Расход на рекламу", value: "348 970 ₽", comment: "Сумма за месяц" },
      { metric: "Расход на заказ", value: "276 ₽", comment: "—" },
      { metric: "Расход на продажу", value: "303 ₽", comment: "—" },
      { metric: "Кликов", value: "40 716", comment: "—" },
      { metric: "Корзина, шт", value: "7 910", comment: "—" },
      { metric: "Корзина, %", value: "19,43%", comment: "—" },
      { metric: "Заказы, шт", value: "1 266", comment: "—" },
      { metric: "Конверсия в заказ", value: "16,01%", comment: "—" },
      { metric: "Выручка", value: "2 054 179 ₽", comment: "—" },
      { metric: "Прибыль", value: "1 158 659 ₽", comment: "—" },
      { metric: "Маржа до ДРР", value: "808 461 ₽", comment: "—" },
      { metric: "Рентабельность, %", value: "22,02%", comment: "—" },
      { metric: "% выкупа", value: "90,8%", comment: "—" },
      { metric: "Остаток", value: "133", comment: "—" },
      { metric: "Оборачиваемость", value: "1", comment: "—" },
      { metric: "Средняя цена", value: "2 107 ₽", comment: "—" },
      { metric: "Самовыкуп ФАКТ", value: "0 ₽", comment: "—" },
      { metric: "Затраты на раздачи", value: "0 ₽", comment: "—" },
      { metric: "Внешняя реклама", value: "0 ₽", comment: "—" },
      { metric: "Цена клика", value: "8,43 ₽", comment: "—" },
      { metric: "Цена заказа", value: "335,97 ₽", comment: "—" },
      { metric: "Конверсия из клика в заказ", value: "3,11%", comment: "—" },
    ],
    extendedStatsAPK: {
      columns: [
        "04.08.2025",
        "05.08.2025",
        "06.08.2025",
        "07.08.2025",
        "08.08.2025",
        "09.08.2025",
        "10.08.2025",
        "11.08.2025",
        "12.08.2025",
        "13.08.2025",
        "14.08.2025",
        "15.08.2025",
      ],
      data: [
        { metric: "Сумма расходов", values: [31098, 18390, 22100, 19800, 24500, 26700, 28900, 31200, 29800, 27500, 30100, 0] },
        { metric: "Количество показов", values: [24244, 19600, 22300, 20100, 24800, 27000, 29200, 31500, 30100, 27800, 30400, 0] },
        { metric: "CPM", values: [1282.71, 938.27, 991.03, 984.08, 987.90, 988.89, 989.73, 990.48, 990.70, 989.93, 990.79, 0] },
        { metric: "CTR, %", values: [1.84, 1.89, 1.87, 1.85, 1.90, 1.88, 1.86, 1.91, 1.89, 1.87, 1.92, 0] },
        { metric: "Количество кликов", values: [446, 376, 417, 372, 471, 508, 543, 602, 569, 520, 584, 0] },
        { metric: "CPC", values: [69.73, 49.70, 52.99, 53.23, 52.02, 52.56, 53.22, 51.83, 52.37, 52.88, 51.54, 0] },
        { metric: "Корзина", values: [27, 3, 15, 8, 22, 19, 25, 28, 21, 18, 24, 0] },
        { metric: "Стоимость корзины", values: [1151.78, 6130.03, 1473.33, 2475.00, 1113.64, 1405.26, 1156.00, 1114.29, 1419.05, 1538.89, 1270.83, 0] },
        { metric: "CR корзины в заказ, %", values: [37.04, 280.00, 40.00, 37.50, 36.36, 36.84, 40.00, 35.71, 38.10, 38.89, 37.50, 0] },
        { metric: "Количество заказов", values: [10, 3, 6, 3, 8, 7, 10, 10, 8, 7, 9, 0] },
        { metric: "Стоимость заказа", values: [3109.80, 6130.03, 3683.33, 6600.00, 3062.50, 3814.29, 2890.00, 3120.00, 3725.00, 3928.57, 3344.44, 0] },
        { metric: "CR (клик-заказ), %", values: [2.24, 0.82, 1.44, 0.81, 1.70, 1.38, 1.84, 1.66, 1.41, 1.35, 1.54, 0] },
        { metric: "СПП, %", values: [23.68, 24.23, 23.95, 24.10, 23.85, 23.92, 24.05, 23.88, 23.97, 24.02, 23.90, 0] },
        { metric: "Цена с СПП", values: [1452.00, 1477.32, 1463.70, 1470.60, 1458.30, 1461.12, 1468.05, 1455.48, 1462.41, 1465.26, 1460.07, 0] },
      ],
    },
    extendedStatsSearch: {
      columns: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      data: [
        { metric: "Сумма расходов", values: [23100, 16168, 18900, 17200, 20500, 22300, 24100, 25800, 24700, 22900, 25100, 0] },
        { metric: "Количество показов", values: [2633, 2323, 2550, 2380, 2680, 2850, 3020, 3190, 3080, 2910, 3130, 0] },
        { metric: "CPM", values: [8773.26, 6959.97, 7411.76, 7226.89, 7641.79, 7824.56, 7973.51, 8087.77, 8012.99, 7869.42, 8019.17, 0] },
        { metric: "CTR %", values: [12.46, 7.40, 9.02, 8.15, 10.45, 9.82, 9.93, 10.03, 9.74, 9.62, 9.90, 0] },
        { metric: "Количество кликов", values: [328, 172, 230, 194, 280, 280, 300, 320, 300, 280, 310, 0] },
        { metric: "CPC", values: [70.43, 94.00, 82.17, 88.66, 73.21, 79.64, 80.33, 80.63, 82.33, 81.79, 80.97, 0] },
        { metric: "CR к корзине, %", values: [16.46, 10.47, 13.04, 11.86, 14.29, 13.57, 13.33, 13.75, 13.33, 13.21, 13.55, 0] },
        { metric: "Корзина", values: [54, 11, 30, 23, 40, 38, 40, 44, 40, 37, 42, 0] },
        { metric: "Стоимость корзины", values: [427.78, 898.22, 630.00, 747.83, 512.50, 586.84, 602.50, 586.36, 617.50, 618.92, 597.62, 0] },
        { metric: "CR корзины в заказ, %", values: [31.48, 38.89, 33.33, 34.78, 32.50, 34.21, 35.00, 34.09, 35.00, 35.14, 33.33, 0] },
        { metric: "Количество заказов", values: [17, 3, 10, 8, 13, 13, 14, 15, 14, 13, 14, 0] },
        { metric: "Стоимость заказа", values: [1358.82, 2309.72, 1890.00, 2150.00, 1576.92, 1715.38, 1721.43, 1720.00, 1764.29, 1761.54, 1792.86, 0] },
        { metric: "CR (клик-заказ), %", values: [5.18, 4.07, 4.35, 4.12, 4.64, 4.64, 4.67, 4.69, 4.67, 4.64, 4.52, 0] },
        { metric: "СПП, %", values: [23.68, 24.23, 23.95, 24.10, 23.85, 23.92, 24.05, 23.88, 23.97, 24.02, 23.90, 0] },
        { metric: "Цена с СПП", values: [1452.00, 1477.32, 1463.70, 1470.60, 1458.30, 1461.12, 1468.05, 1455.48, 1462.41, 1465.26, 1460.07, 0] },
      ],
    },
  },
  {
    article: "Massager22",
    revenue: "296 000 Р",
    margin: "92 300 Р",
    buyoutPercent: "91.5%",
    ctr: "2.1%",
    crCartPurchase: "55%",
    change: { type: "up", value: "+7%" },
    generalReport: [
      { metric: "Расход на рекламу", value: "425 000 ₽", comment: "Сумма за месяц" },
      { metric: "Расход на заказ", value: "312 ₽", comment: "—" },
      { metric: "Расход на продажу", value: "345 ₽", comment: "—" },
      { metric: "Кликов", value: "52 000", comment: "—" },
      { metric: "Корзина, шт", value: "9 500", comment: "—" },
      { metric: "Корзина, %", value: "18,27%", comment: "—" },
      { metric: "Заказы, шт", value: "1 362", comment: "—" },
      { metric: "Конверсия в заказ", value: "14,34%", comment: "—" },
      { metric: "Выручка", value: "2 450 000 ₽", comment: "—" },
      { metric: "Прибыль", value: "1 320 000 ₽", comment: "—" },
      { metric: "Маржа до ДРР", value: "950 000 ₽", comment: "—" },
      { metric: "Рентабельность, %", value: "25,15%", comment: "—" },
      { metric: "% выкупа", value: "91,5%", comment: "—" },
      { metric: "Остаток", value: "98", comment: "—" },
      { metric: "Оборачиваемость", value: "1.2", comment: "—" },
      { metric: "Средняя цена", value: "2 350 ₽", comment: "—" },
      { metric: "Самовыкуп ФАКТ", value: "0 ₽", comment: "—" },
      { metric: "Затраты на раздачи", value: "0 ₽", comment: "—" },
      { metric: "Внешняя реклама", value: "0 ₽", comment: "—" },
      { metric: "Цена клика", value: "8,17 ₽", comment: "—" },
      { metric: "Цена заказа", value: "312,04 ₽", comment: "—" },
      { metric: "Конверсия из клика в заказ", value: "2,62%", comment: "—" },
    ],
    extendedStatsAPK: {
      columns: [
        "04.08.2025",
        "05.08.2025",
        "06.08.2025",
        "07.08.2025",
        "08.08.2025",
        "09.08.2025",
        "10.08.2025",
        "11.08.2025",
        "12.08.2025",
        "13.08.2025",
        "14.08.2025",
        "15.08.2025",
      ],
      data: [
        { metric: "Сумма расходов", values: [35200, 21500, 24800, 22500, 27800, 30100, 32500, 34800, 33200, 30800, 33500, 0] },
        { metric: "Количество показов", values: [26500, 21400, 24300, 21900, 27000, 29300, 31700, 34000, 32500, 30100, 32800, 0] },
        { metric: "CPM", values: [1328.30, 1004.67, 1020.58, 1027.40, 1029.63, 1027.30, 1025.24, 1023.53, 1021.54, 1023.26, 1021.34, 0] },
        { metric: "CTR, %", values: [2.05, 2.10, 2.08, 2.06, 2.12, 2.09, 2.07, 2.13, 2.11, 2.09, 2.15, 0] },
        { metric: "Количество кликов", values: [543, 449, 505, 451, 572, 612, 656, 724, 686, 629, 705, 0] },
        { metric: "CPC", values: [64.83, 47.88, 49.11, 49.89, 48.60, 49.18, 49.54, 48.07, 48.40, 48.97, 47.52, 0] },
        { metric: "Корзина", values: [32, 4, 18, 10, 26, 23, 30, 33, 25, 22, 29, 0] },
        { metric: "Стоимость корзины", values: [1100.00, 5375.00, 1377.78, 2250.00, 1069.23, 1308.70, 1083.33, 1054.55, 1328.00, 1400.00, 1206.90, 0] },
        { metric: "CR корзины в заказ, %", values: [37.50, 275.00, 38.89, 35.00, 34.62, 34.78, 40.00, 33.33, 36.00, 36.36, 34.48, 0] },
        { metric: "Количество заказов", values: [12, 4, 7, 4, 9, 8, 12, 11, 9, 8, 10, 0] },
        { metric: "Стоимость заказа", values: [2933.33, 5375.00, 3542.86, 5625.00, 3088.89, 3762.50, 2708.33, 3163.64, 3688.89, 3850.00, 3395.00, 0] },
        { metric: "CR (клик-заказ), %", values: [2.21, 0.89, 1.39, 0.89, 1.57, 1.31, 1.83, 1.52, 1.31, 1.27, 1.42, 0] },
        { metric: "СПП, %", values: [24.10, 24.65, 24.37, 24.52, 24.27, 24.34, 24.47, 24.30, 24.39, 24.44, 24.32, 0] },
        { metric: "Цена с СПП", values: [1475.00, 1500.00, 1485.00, 1490.00, 1477.50, 1482.50, 1495.00, 1472.50, 1487.50, 1492.50, 1470.00, 0] },
      ],
    },
    extendedStatsSearch: {
      columns: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      data: [
        { metric: "Сумма расходов", values: [26800, 18750, 21900, 19900, 23700, 25800, 27900, 29800, 28500, 26400, 28900, 0] },
        { metric: "Количество показов", values: [2880, 2540, 2790, 2600, 2930, 3120, 3300, 3480, 3360, 3180, 3420, 0] },
        { metric: "CPM", values: [9305.56, 7381.89, 7849.46, 7653.85, 8088.74, 8269.23, 8454.55, 8563.22, 8482.14, 8301.89, 8450.29, 0] },
        { metric: "CTR %", values: [13.19, 7.87, 9.68, 8.65, 11.26, 10.58, 10.61, 10.63, 10.42, 10.31, 10.53, 0] },
        { metric: "Количество кликов", values: [380, 200, 270, 225, 330, 330, 350, 370, 350, 328, 360, 0] },
        { metric: "CPC", values: [70.53, 93.75, 81.11, 88.44, 71.82, 78.18, 79.71, 80.54, 81.43, 80.49, 80.28, 0] },
        { metric: "CR к корзине, %", values: [17.11, 10.50, 13.70, 12.44, 15.15, 14.24, 14.00, 14.59, 14.00, 13.72, 14.17, 0] },
        { metric: "Корзина", values: [65, 21, 37, 28, 50, 47, 49, 54, 49, 45, 51, 0] },
        { metric: "Стоимость корзины", values: [412.31, 892.86, 591.89, 710.71, 474.00, 548.94, 569.39, 551.85, 581.63, 586.67, 566.67, 0] },
        { metric: "CR корзины в заказ, %", values: [32.31, 38.10, 32.43, 35.71, 32.00, 34.04, 35.71, 33.33, 35.71, 35.56, 33.33, 0] },
        { metric: "Количество заказов", values: [21, 8, 12, 10, 16, 16, 17, 18, 17, 16, 17, 0] },
        { metric: "Стоимость заказа", values: [1276.19, 2343.75, 1825.00, 1990.00, 1481.25, 1612.50, 1641.18, 1655.56, 1676.47, 1650.00, 1700.00, 0] },
        { metric: "CR (клик-заказ), %", values: [5.53, 4.00, 4.44, 4.44, 4.85, 4.85, 4.86, 4.86, 4.86, 4.88, 4.72, 0] },
        { metric: "СПП, %", values: [24.10, 24.65, 24.37, 24.52, 24.27, 24.34, 24.47, 24.30, 24.39, 24.44, 24.32, 0] },
        { metric: "Цена с СПП", values: [1475.00, 1500.00, 1485.00, 1490.00, 1477.50, 1482.50, 1495.00, 1472.50, 1487.50, 1492.50, 1470.00, 0] },
      ],
    },
  },
  {
    article: "Washer37024",
    revenue: "124 000 Р",
    margin: "31 100 Р",
    buyoutPercent: "82.0%",
    ctr: "1.3%",
    crCartPurchase: "47%",
    change: { type: "down", value: "-5%" },
    generalReport: [
      { metric: "Расход на рекламу", value: "285 000 ₽", comment: "Сумма за месяц" },
      { metric: "Расход на заказ", value: "315 ₽", comment: "—" },
      { metric: "Расход на продажу", value: "342 ₽", comment: "—" },
      { metric: "Кликов", value: "35 000", comment: "—" },
      { metric: "Корзина, шт", value: "6 200", comment: "—" },
      { metric: "Корзина, %", value: "17,71%", comment: "—" },
      { metric: "Заказы, шт", value: "905", comment: "—" },
      { metric: "Конверсия в заказ", value: "14,52%", comment: "—" },
      { metric: "Выручка", value: "1 680 000 ₽", comment: "—" },
      { metric: "Прибыль", value: "920 000 ₽", comment: "—" },
      { metric: "Маржа до ДРР", value: "635 000 ₽", comment: "—" },
      { metric: "Рентабельность, %", value: "19,85%", comment: "—" },
      { metric: "% выкупа", value: "82,0%", comment: "—" },
      { metric: "Остаток", value: "167", comment: "—" },
      { metric: "Оборачиваемость", value: "0.9", comment: "—" },
      { metric: "Средняя цена", value: "1 856 ₽", comment: "—" },
      { metric: "Самовыкуп ФАКТ", value: "0 ₽", comment: "—" },
      { metric: "Затраты на раздачи", value: "0 ₽", comment: "—" },
      { metric: "Внешняя реклама", value: "0 ₽", comment: "—" },
      { metric: "Цена клика", value: "8,14 ₽", comment: "—" },
      { metric: "Цена заказа", value: "314,92 ₽", comment: "—" },
      { metric: "Конверсия из клика в заказ", value: "2,59%", comment: "—" },
    ],
    extendedStatsAPK: {
      columns: [
        "04.08.2025",
        "05.08.2025",
        "06.08.2025",
        "07.08.2025",
        "08.08.2025",
        "09.08.2025",
        "10.08.2025",
        "11.08.2025",
        "12.08.2025",
        "13.08.2025",
        "14.08.2025",
        "15.08.2025",
      ],
      data: [
        { metric: "Сумма расходов", values: [26800, 15800, 19000, 17000, 21000, 22900, 24800, 26700, 25500, 23600, 25800, 0] },
        { metric: "Количество показов", values: [21800, 17600, 20000, 18000, 22200, 24200, 26200, 28200, 27000, 25000, 27200, 0] },
        { metric: "CPM", values: [1229.36, 897.73, 950.00, 944.44, 945.95, 946.28, 946.56, 946.81, 944.44, 944.00, 948.53, 0] },
        { metric: "CTR, %", values: [1.28, 1.31, 1.30, 1.29, 1.33, 1.31, 1.30, 1.35, 1.33, 1.31, 1.36, 0] },
        { metric: "Количество кликов", values: [279, 231, 260, 232, 295, 317, 341, 381, 359, 328, 370, 0] },
        { metric: "CPC", values: [96.06, 68.40, 73.08, 73.28, 71.19, 72.24, 72.73, 70.08, 71.03, 71.95, 69.73, 0] },
        { metric: "Корзина", values: [21, 2, 12, 6, 18, 15, 20, 23, 17, 14, 19, 0] },
        { metric: "Стоимость корзины", values: [1276.19, 7900.00, 1583.33, 2833.33, 1166.67, 1526.67, 930.00, 1156.52, 1235.29, 1357.14, 1052.63, 0] },
        { metric: "CR корзины в заказ, %", values: [33.33, 300.00, 33.33, 33.33, 33.33, 33.33, 40.00, 30.43, 35.29, 35.71, 31.58, 0] },
        { metric: "Количество заказов", values: [7, 2, 4, 2, 6, 5, 8, 7, 6, 5, 6, 0] },
        { metric: "Стоимость заказа", values: [3828.57, 7900.00, 4750.00, 8500.00, 3500.00, 4580.00, 3100.00, 3814.29, 4250.00, 4720.00, 4300.00, 0] },
        { metric: "CR (клик-заказ), %", values: [2.51, 0.87, 1.54, 0.86, 2.03, 1.58, 2.35, 1.84, 1.67, 1.52, 1.62, 0] },
        { metric: "СПП, %", values: [22.50, 23.00, 22.75, 22.88, 22.63, 22.69, 22.81, 22.69, 22.75, 22.81, 22.69, 0] },
        { metric: "Цена с СПП", values: [1440.00, 1464.00, 1452.00, 1456.00, 1442.00, 1444.00, 1452.00, 1444.00, 1450.00, 1454.00, 1444.00, 0] },
      ],
    },
    extendedStatsSearch: {
      columns: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      data: [
        { metric: "Сумма расходов", values: [19800, 13850, 16200, 14750, 17500, 19050, 20600, 22050, 21100, 19550, 21400, 0] },
        { metric: "Количество показов", values: [2380, 2100, 2305, 2150, 2420, 2575, 2725, 2875, 2775, 2625, 2815, 0] },
        { metric: "CPM", values: [8319.33, 6595.24, 7028.20, 6860.47, 7231.40, 7398.06, 7559.63, 7673.04, 7603.60, 7447.62, 7602.13, 0] },
        { metric: "CTR %", values: [11.34, 6.67, 8.24, 7.44, 9.92, 9.32, 9.36, 9.39, 9.19, 9.14, 9.24, 0] },
        { metric: "Количество кликов", values: [270, 140, 190, 160, 240, 240, 255, 270, 255, 240, 260, 0] },
        { metric: "CPC", values: [73.33, 98.93, 85.26, 92.19, 72.92, 79.38, 80.78, 81.67, 82.75, 81.46, 82.31, 0] },
        { metric: "CR к корзине, %", values: [15.19, 9.29, 11.58, 10.63, 12.92, 12.08, 11.76, 12.22, 11.76, 11.67, 11.92, 0] },
        { metric: "Корзина", values: [41, 13, 22, 17, 31, 29, 30, 33, 30, 28, 31, 0] },
        { metric: "Стоимость корзины", values: [482.93, 1065.38, 736.36, 867.65, 564.52, 656.90, 686.67, 668.18, 700.00, 698.21, 690.32, 0] },
        { metric: "CR корзины в заказ, %", values: [29.27, 30.77, 31.82, 29.41, 29.03, 31.03, 33.33, 30.30, 33.33, 32.14, 29.03, 0] },
        { metric: "Количество заказов", values: [12, 4, 7, 5, 9, 9, 10, 10, 10, 9, 9, 0] },
        { metric: "Стоимость заказа", values: [1650.00, 3462.50, 2314.29, 2950.00, 1944.44, 2116.67, 2060.00, 2205.00, 2110.00, 2172.22, 2377.78, 0] },
        { metric: "CR (клик-заказ), %", values: [4.44, 2.86, 3.68, 3.13, 3.75, 3.75, 3.92, 3.70, 3.92, 3.75, 3.46, 0] },
        { metric: "СПП, %", values: [22.50, 23.00, 22.75, 22.88, 22.63, 22.69, 22.81, 22.69, 22.75, 22.81, 22.69, 0] },
        { metric: "Цена с СПП", values: [1440.00, 1464.00, 1452.00, 1456.00, 1442.00, 1444.00, 1452.00, 1444.00, 1450.00, 1454.00, 1444.00, 0] },
      ],
    },
  },
]

export function AdvertisingRNP() {
  const { toast } = useToast()
  const [period, setPeriod] = useState("01.10.25 — 31.10.25")
  const [platform, setPlatform] = useState("Все")
  const [brand, setBrand] = useState("Все")
  const [article, setArticle] = useState("")
  const [manager, setManager] = useState("Все")
  const [legalEntity, setLegalEntity] = useState("Все")
  const [reportType, setReportType] = useState("Факт")
  const [grouping, setGrouping] = useState("День")
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)

  const handleConfigureBlocks = () => {
    toast({
      title: "Настройка блоков",
      description: "Откройте настройки для выбора отображаемых блоков",
    })
  }

  const handleExport = () => {
    toast({
      title: "Экспорт данных",
      description: "Файл успешно сгенерирован и готов к скачиванию",
      variant: "default",
    })
  }

  const handleRefresh = () => {
    toast({
      title: "Данные обновлены",
      description: "Информация успешно обновлена",
      variant: "default",
    })
  }

  // Компонент для отображения тренда
  const TrendIndicator = ({
    trend,
  }: {
    trend: { type: "up" | "down" | "neutral"; value: string; text?: string }
  }) => {
    if (trend.type === "up") {
      return (
        <div className="flex items-center gap-1 text-green-500 text-sm">
          <TrendingUp className="h-3 w-3" />
          <span>
            {trend.value} {trend.text && trend.text}
          </span>
        </div>
      )
    } else if (trend.type === "down") {
      return (
        <div className="flex items-center gap-1 text-red-500 text-sm">
          <TrendingDown className="h-3 w-3" />
          <span>
            {trend.value} {trend.text && trend.text}
          </span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-orange-500 text-sm">
          <Minus className="h-3 w-3" />
          <span>
            {trend.value} {trend.text && trend.text}
          </span>
        </div>
      )
    }
  }

  // Форматирование чисел с разделителями (российский формат)
  const formatNumber = (num: number | string): string => {
    if (typeof num === "string") return num
    // Для целых чисел - без дробной части
    if (num % 1 === 0) {
      return new Intl.NumberFormat("ru-RU").format(num)
    }
    // Для дробных чисел - с запятой (ru-RU уже использует запятую)
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и кнопки действий */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">РНП — Рука на пульсе</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleConfigureBlocks}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Настроить блоки
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
            <Button
              onClick={handleRefresh}
              className="gap-2 bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500"
            >
              <RefreshCw className="h-4 w-4" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <Card className="glass-effect">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Период
                </label>
                <Input
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="01.10.25 — 31.10.25"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Площадка
                </label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Все">Все</SelectItem>
                    <SelectItem value="Wildberries">Wildberries</SelectItem>
                    <SelectItem value="Ozon">Ozon</SelectItem>
                    <SelectItem value="Яндекс.Маркет">Яндекс.Маркет</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Бренд
                </label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Все">Все</SelectItem>
                    <SelectItem value="Бренд A">Бренд A</SelectItem>
                    <SelectItem value="Бренд B">Бренд B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Артикул
                </label>
                <Input
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  placeholder="напр. 370240817"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Менеджер
                </label>
                <Select value={manager} onValueChange={setManager}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Все">Все</SelectItem>
                    <SelectItem value="Менеджер 1">Менеджер 1</SelectItem>
                    <SelectItem value="Менеджер 2">Менеджер 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Юрлицо
                </label>
                <Select value={legalEntity} onValueChange={setLegalEntity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Все">Все</SelectItem>
                    <SelectItem value="ИП Васильев">ИП Васильев</SelectItem>
                    <SelectItem value="ООО MarketAI">ООО MarketAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Тип отчёта
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Факт">Факт</SelectItem>
                    <SelectItem value="План">План</SelectItem>
                    <SelectItem value="Прогноз">Прогноз</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Группировка
                </label>
                <Select value={grouping} onValueChange={setGrouping}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="День">День</SelectItem>
                    <SelectItem value="Неделя">Неделя</SelectItem>
                    <SelectItem value="Месяц">Месяц</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Карточки метрик */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {metricsCards.map((metric) => (
            <Card key={metric.id} className="glass-effect dashboard-metric-card">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                    <TrendIndicator trend={metric.trend as any} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Таблица товаров с основными метриками */}
        <Card className="glass-effect">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Товары
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Артикул</TableHead>
                    <TableHead className="text-right">Выручка</TableHead>
                    <TableHead className="text-right bg-green-50/30 dark:bg-green-950/20 border-l-2 border-l-green-500">Маржа</TableHead>
                    <TableHead className="text-right">% выкупа</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">CR корзина-покупка</TableHead>
                    <TableHead className="text-right">Изменение</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsData.map((product, index) => (
                    <TableRow 
                      key={index} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <TableCell className="font-medium">{product.article}</TableCell>
                      <TableCell className="text-right">{product.revenue}</TableCell>
                      <TableCell className="text-right bg-green-50/30 dark:bg-green-950/20 border-l-2 border-l-green-500">{product.margin}</TableCell>
                      <TableCell className="text-right">{product.buyoutPercent}</TableCell>
                      <TableCell className="text-right">{product.ctr}</TableCell>
                      <TableCell className="text-right">{product.crCartPurchase}</TableCell>
                      <TableCell className="text-right">
                        <TrendIndicator trend={product.change} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Popup с детальной информацией по товару */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle>Детальная информация по товару: {selectedProduct.article}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full flex-1 flex flex-col overflow-hidden">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Общий отчёт</TabsTrigger>
                    <TabsTrigger value="apk">Расширенная статистика - APK</TabsTrigger>
                    <TabsTrigger value="search">Расширенная статистика — Поиск</TabsTrigger>
                  </TabsList>
                  
                  {/* Вкладка: Общий отчёт */}
                  <TabsContent value="general" className="mt-4 flex-1 overflow-auto">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Показатель</TableHead>
                            <TableHead className="text-right">Значение</TableHead>
                            <TableHead className="text-right">Комментарий</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProduct.generalReport.map((row, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">{row.metric}</TableCell>
                              <TableCell className="text-right">{row.value}</TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {row.comment}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Вкладка: Расширенная статистика - APK */}
                  <TabsContent value="apk" className="mt-4 flex-1 overflow-auto">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="sticky left-0 bg-background z-20 border-r">
                              Measure
                            </TableHead>
                            {selectedProduct.extendedStatsAPK.columns.map((col) => (
                              <TableHead key={col} className="text-right min-w-[100px]">
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProduct.extendedStatsAPK.data.map((row, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">
                                {row.metric}
                              </TableCell>
                              {row.values.map((value, valIndex) => (
                                <TableCell
                                  key={valIndex}
                                  className="text-right"
                                >
                                  {value === 0 ? "—" : formatNumber(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Вкладка: Расширенная статистика — Поиск */}
                  <TabsContent value="search" className="mt-4 flex-1 overflow-auto">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="sticky left-0 bg-background z-20 border-r">
                              Measure
                            </TableHead>
                            {selectedProduct.extendedStatsSearch.columns.map((col) => (
                              <TableHead key={col} className="text-right min-w-[100px]">
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProduct.extendedStatsSearch.data.map((row, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">
                                {row.metric}
                              </TableCell>
                              {row.values.map((value, valIndex) => (
                                <TableCell
                                  key={valIndex}
                                  className="text-right"
                                >
                                  {value === 0 ? "—" : formatNumber(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

