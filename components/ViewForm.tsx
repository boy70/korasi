"use client"

import type React from "react"
import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import { Calendar, MapPin, Briefcase, User, FileText, DollarSign } from "lucide-react"

type FormData = {
  id: number
  name: string
  surname: string
  dob: string
  idNumber: string
  issueDateAndPlace: string
  address: string
  educationLevel: string
  latestDegree: string
  experience: string
  activitySpaces: string[]
  roomCount: string
  hallCount: string
  capacity: {
    accommodation: string
    tents: string
    activitySpaces: string
  }
  services: string[]
  projectNature: string
  placecount: string
  directorName: string
  directorId: string
  directorCertification: string
  investmentType: string[]
  investorInfo: string
  commercialName: string
  socialAddress: string
  state: string
  district: string
  municipality: string
  postalCode: string
  activitiesNature: string
  investmentNature: string[]
  activityNature: string[]
  projectName: string
  projectAddress: string
  email: string
  declaration: boolean
  signatureDate: string
  funding: number[]
  expenses: number[]
}

const FormField = ({
  label,
  value,
  icon: Icon,
}: { label: string; value: string | number | boolean | React.ReactNode; icon?: React.ElementType }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}:
    </label>
    <div className="p-2 bg-gray-50 rounded border border-gray-200">{value || "—"}</div>
  </div>
)

export default function ViewForm({ submission }: { submission: FormData }) {
  const [formData, setFormData] = useState<FormData>(submission)
  const [fundingTotal, setFundingTotal] = useState<number>(0)
  const [expensesTotal, setExpensesTotal] = useState<number>(0)

  useEffect(() => {
    const fundingSum = formData.funding.reduce((sum, value) => sum + (Number(value) || 0), 0)
    const expensesSum = formData.expenses.reduce((sum, value) => sum + (Number(value) || 0), 0)
    setFundingTotal(fundingSum)
    setExpensesTotal(expensesSum)
  }, [formData.funding, formData.expenses])

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFont("helvetica", "normal", "normal")
    doc.setFontSize(18)
    doc.text("استمارة تنظيم الأنشطة الترفيهية", 200, 20, { align: "right" })

    doc.setFontSize(12)
    let yPos = 40

    const addField = (label: string, value: string) => {
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(label, 200, yPos, { align: "right" })
      doc.setFontSize(12)
      doc.setTextColor(0)
      doc.text(value, 200, yPos + 5, { align: "right" })
      yPos += 15
      if (yPos > 280) {
        doc.addPage()
        yPos = 20
      }
    }

    addField("الاسم", formData.name)
    addField("اللقب", formData.surname)
    addField("تاريخ الميلاد", formData.dob)
    addField("رقم البطاقة الوطنية", formData.idNumber)
    addField("تاريخ ومكان الإصدار", formData.issueDateAndPlace)
    addField("العنوان الشخصي", formData.address)
    addField("المستوى التعليمي", formData.educationLevel)
    addField("آخر شهادة متحصل عليها", formData.latestDegree)
    addField("الأقدمية في النشاط", formData.experience)
    addField("المؤسسة الشبابية الخاصة", formData.activitySpaces.join(", "))
    addField("عدد الغرف", formData.roomCount)
    addField("عدد القاعات", formData.hallCount)
    addField("طاقة الاستيعاب (بالمبيت)", formData.capacity.accommodation)
    addField("طاقة الاستيعاب (تحت الخيام)", formData.capacity.tents)
    addField("طاقة الاستيعاب (بفضائات التنشيط)", formData.capacity.activitySpaces)
    addField("الخدمات", formData.services.join(", "))
    addField("طبيعة المشروع", formData.projectNature)
    addField("عدد مواطن الشغل", formData.placecount)
    addField("اسم مدير المؤسسة", formData.directorName)
    addField("رقم بطاقة مدير المؤسسة", formData.directorId)
    addField("الشهادة الأخيرة لمدير المؤسسة", formData.directorCertification)
    addField("الاستثمار في هذا النشاط", formData.investmentType.join(", "))
    addField("معلومات عن المستثمر", formData.investorInfo)
    addField("الاسم التجاري", formData.commercialName)
    addField("عنوان المقر الاجتماعي", formData.socialAddress)
    addField("الولاية", formData.state)
    addField("المعتمدية", formData.district)
    addField("البلدية", formData.municipality)
    addField("الرمز البريدي", formData.postalCode)
    addField("طبيعة أنشطة تنظيم الرحلات خارج الولاية", formData.activitiesNature)
    addField("الاستثمار في أنشطة الشباب والطفولة", formData.investmentNature.join(", "))
    addField("طبيعة أنشطة الشباب والطفولة", formData.activityNature.join(", "))
    addField("اسم مشروع أنشطة الشباب والطفولة", formData.projectName)
    addField("عنوان مشروع أنشطة الشباب والطفولة", formData.projectAddress)
    addField("البريد الإلكتروني", formData.email)
    addField("الإقرار بصحة البيانات", formData.declaration ? "نعم" : "لا")
    addField("تاريخ التوقيع", formData.signatureDate)

    doc.addPage()
    yPos = 20
    doc.setFontSize(14)
    doc.text("المعلومات المالية", 200, yPos, { align: "right" })
    yPos += 15

    const financialData = [
      ["الأرض", "أموال ذاتية"],
      ["البنائات", "قروض طويلة المدى"],
      ["التهيئة", "قروض متوسطة المدى"],
      ["التجهيز", "قروض قصيرة المدى"],
      ["المعدات", "منح"],
      ["موارد اخرى", "مصاريف مختلفة"],
    ]

    financialData.forEach(([fundingLabel, expenseLabel], index) => {
      doc.text(`${fundingLabel}: ${formData.funding[index]}`, 200, yPos, { align: "right" })
      doc.text(`${expenseLabel}: ${formData.expenses[index]}`, 100, yPos, { align: "right" })
      yPos += 10
    })

    yPos += 5
    doc.setFontSize(12)
    doc.text(`المجموع (التمويل): ${fundingTotal}`, 200, yPos, { align: "right" })
    doc.text(`المجموع (المصاريف): ${expensesTotal}`, 100, yPos, { align: "right" })

    doc.save("استمارة_تنظيم_الأنشطة_الترفيهية.pdf")
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">استمارة تنظيم الأنشطة الترفيهية</h1>
      </div>

      <div className="p-6">
        {/* Personal Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <User className="w-6 h-6 mr-2" />
            المستثمر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="الاسم" value={formData.name} icon={User} />
            <FormField label="اللقب" value={formData.surname} icon={User} />
            <FormField label="تاريخ الميلاد" value={formData.dob} icon={Calendar} />
            <FormField label="رقم البطاقة الوطنية" value={formData.idNumber} icon={FileText} />
            <FormField label="تاريخ ومكان الإصدار" value={formData.issueDateAndPlace} icon={Calendar} />
            <FormField label="العنوان الشخصي" value={formData.address} icon={MapPin} />
            <FormField label="المستوى التعليمي" value={formData.educationLevel} icon={Briefcase} />
            <FormField label="آخر شهادة متحصل عليها" value={formData.latestDegree} icon={FileText} />
            <FormField label="الأقدمية في النشاط" value={formData.experience} icon={Briefcase} />
          </div>
        </section>

        {/* Activity Properties */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            خاصيات النشاط
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="المؤسسة الشبابية الخاصة" value={formData.activitySpaces.join(", ")} icon={Briefcase} />
            <FormField label="عدد الغرف" value={formData.roomCount} icon={Briefcase} />
            <FormField label="عدد القاعات" value={formData.hallCount} icon={Briefcase} />
            <FormField
              label="طاقة الاستيعاب"
              value={
                <div>
                  <div>بالمبيت: {formData.capacity.accommodation}</div>
                  <div>تحت الخيام: {formData.capacity.tents}</div>
                  <div>بفضائات التنشيط: {formData.capacity.activitySpaces}</div>
                </div>
              }
              icon={User}
            />
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            الخدمات المقدمة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="الخدمات" value={formData.services.join(", ")} icon={Briefcase} />
            <FormField label="طبيعة المشروع" value={formData.projectNature} icon={Briefcase} />
            <FormField label="عدد مواطن الشغل" value={formData.placecount} icon={User} />
          </div>
        </section>

        {/* Director Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <User className="w-6 h-6 mr-2" />
            مدير المؤسسة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="الاسم الكامل" value={formData.directorName} icon={User} />
            <FormField label="رقم البطاقة" value={formData.directorId} icon={FileText} />
            <FormField label="الشهادة الأخيرة" value={formData.directorCertification} icon={FileText} />
          </div>
        </section>

        {/* Investment Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            تنضيم الرحلات خارج الولاية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="الاستثمار في هذا النشاط" value={formData.investmentType.join(", ")} icon={DollarSign} />
            <FormField label="التعريف بالمستثمر" value={formData.investorInfo} icon={User} />
            <FormField label="الاسم التجاري" value={formData.commercialName} icon={Briefcase} />
            <FormField label="عنوان المقر الاجتماعي" value={formData.socialAddress} icon={MapPin} />
            <FormField label="الولاية" value={formData.state} icon={MapPin} />
            <FormField label="المعتمدية" value={formData.district} icon={MapPin} />
            <FormField label="البلدية" value={formData.municipality} icon={MapPin} />
            <FormField label="الرمز البريدي" value={formData.postalCode} icon={MapPin} />
          </div>
        </section>

        {/* Activities */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            تنظيم الأنشطة الترفيهية للشباب و الطفولة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="الاستثمار في هذا النشاط" value={formData.investmentNature.join(", ")} icon={DollarSign} />
            <FormField label="طبيعة النشاط" value={formData.activityNature.join(", ")} icon={Briefcase} />
            <FormField label="اسم المشروع" value={formData.projectName} icon={Briefcase} />
            <FormField label="عنوان المشروع" value={formData.projectAddress} icon={MapPin} />
            <FormField label="البريد الإلكتروني" value={formData.email} icon={FileText} />
          </div>
        </section>

        {/* Financial Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <DollarSign className="w-6 h-6 mr-2" />
            المعلومات المالية
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50">الاستثمار</th>
                  <th className="px-4 py-2 bg-gray-50">المبلغ</th>
                  <th className="px-4 py-2 bg-gray-50">التمويل</th>
                  <th className="px-4 py-2 bg-gray-50">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["الأرض", "أموال ذاتية"],
                  ["البنائات", "قروض طويلة المدى"],
                  ["التهيئة", "قروض متوسطة المدى"],
                  ["التجهيز", "قروض قصيرة المدى"],
                  ["المعدات", "منح"],
                  ["موارد اخرى", "مصاريف مختلفة"],
                ].map(([fundingLabel, expenseLabel], index) => (
                  <tr key={index} className={index % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2 border">{fundingLabel}</td>
                    <td className="px-4 py-2 border text-right">{formData.funding[index]}</td>
                    <td className="px-4 py-2 border">{expenseLabel}</td>
                    <td className="px-4 py-2 border text-right">{formData.expenses[index]}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td className="px-4 py-2 border">المجموع</td>
                  <td className="px-4 py-2 border text-right">{fundingTotal}</td>
                  <td className="px-4 py-2 border">المجموع</td>
                  <td className="px-4 py-2 border text-right">{expensesTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Declaration */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            الإقرار
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="الإقرار بصحة البيانات" value={formData.declaration ? "نعم" : "لا"} icon={FileText} />
            <FormField label="تاريخ التوقيع" value={formData.signatureDate} icon={Calendar} />
          </div>
        </section>

        <div className="mt-6">
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            تصدير إلى PDF
          </button>
        </div>
      </div>
    </div>
  )
}

