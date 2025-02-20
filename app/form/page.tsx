"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import jsPDF from "jspdf"; 
type FormData = {
  // Personal Information
  name: string;
  surname: string;
  dob: string;
  idNumber: string[];
  issueDateAndPlace: string;
  address: string;
  educationLevel: string;
  latestDegree: string;
  experience: string;

  // Activity Properties
  activitySpaces: string[];
  roomCount: string;
  hallCount: string;
  capacity: {
    accommodation: string;
    tents: string;
    activitySpaces: string;
  };

  // Services Section
  services: string[];
  projectNature: string;
  placecount: string;

  // Director Information
  directorName: string;
  directorId: string[];
  directorCertification: string;

  // Investment Section
  investmentType: string[];
  investorInfo: string;
  commercialName: string;
  socialAddress: string;
  state: string;
  district: string;
  municipality: string;
  postalCode: string;

  // Women & Childhood Activities
  activitiesNature: string;
  investmentNature: string[];
  activityNature: string[];
  projectName: string;
  projectAddress: string;
  email: string;

  // Declaration
  declaration: boolean;
  signatureDate: string;

  // Funding and Expenses
  funding: string[];
  expenses: string[];
};

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    dob: "",
    idNumber: Array(8).fill(""),
    issueDateAndPlace: "",
    address: "",
    educationLevel: "",
    latestDegree: "",
    experience: "",
    activitySpaces: [],
    roomCount: "",
    hallCount: "",
    capacity: { accommodation: "", tents: "", activitySpaces: "" },
    services: [],
    projectNature: "",
    placecount: "",
    directorName: "",
    directorId: Array(8).fill(""),
    directorCertification: "",
    investmentType: [],
    investorInfo: "",
    commercialName: "",
    socialAddress: "",
    state: "",
    district: "",
    municipality: "",
    postalCode: "",
    activitiesNature: "",
    investmentNature: [],
    activityNature: [],
    projectName: "",
    projectAddress: "",
    email: "",
    declaration: false,
    signatureDate: "",
    funding: Array(6).fill(""),
    expenses: Array(6).fill(""),
  });

  const [fundingTotal, setFundingTotal] = useState<number>(0);
  const [expensesTotal, setExpensesTotal] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [field]: value,
        },
      }));
    } else if (type === "checkbox") {
      const inputElement = e.target as HTMLInputElement;
      const current = [...(formData[name as keyof typeof formData] as string[])];
      const updated = inputElement.checked ? [...current, value] : current.filter((item) => item !== value);
      setFormData((prev) => ({ ...prev, [name]: updated }));
    } else if (name.startsWith("funding[") || name.startsWith("expenses[")) {
      const [arrayName, indexStr] = name.split("[");
      const index = Number.parseInt(indexStr.replace("]", ""));
      setFormData((prev) => ({
        ...prev,
        [arrayName]: (prev[arrayName as keyof typeof prev] as string[]).map((item, i) => (i === index ? value : item)),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleIdNumber = (index: number, value: string, field: "idNumber" | "directorId") => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      setFormData((prev) => {
        const newArray = [...prev[field]];
        newArray[index] = value;
        return { ...prev, [field]: newArray };
      });
      if (value && index < 7) {
        const nextInput = document.getElementById(`${field}-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const calculateTotals = () => {
    const fundingSum = formData.funding.reduce((sum, value) => sum + Number.parseFloat(value || "0"), 0);
    const expensesSum = formData.expenses.reduce((sum, value) => sum + Number.parseFloat(value || "0"), 0);
    setFundingTotal(fundingSum);
    setExpensesTotal(expensesSum);
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.funding, formData.expenses]);
// Function to generate PDF
const generatePDF = () => {
  const doc = new jsPDF();

  // Add form data to the PDF
  doc.setFontSize(12);
  doc.text("استمارة تنظيم الأنشطة الترفيهية", 10, 10);

  let yOffset = 20; // Vertical offset for text

  // Personal Information
  doc.text(`الاسم: ${formData.name}`, 10, yOffset);
  yOffset += 10;
  doc.text(`اللقب: ${formData.surname}`, 10, yOffset);
  yOffset += 10;
  doc.text(`تاريخ الولادة: ${new Date(formData.dob).toLocaleDateString()}`, 10, yOffset);

  yOffset += 10;
  doc.text(`رقم البطاقة الوطنية: ${formData.idNumber.join("")}`, 10, yOffset);
  yOffset += 10;
  doc.text(`تاريخ ومكان الإصدار: ${formData.issueDateAndPlace}`, 10, yOffset);
  yOffset += 10;
  doc.text(`العنوان الشخصي: ${formData.address}`, 10, yOffset);
  yOffset += 10;
  doc.text(`المستوى التعليمي: ${formData.educationLevel}`, 10, yOffset);
  yOffset += 10;
  doc.text(`آخر شهادة متحصل عليها: ${formData.latestDegree}`, 10, yOffset);
  yOffset += 10;
  doc.text(`الأقدمية في النشاط: ${formData.experience}`, 10, yOffset);
  yOffset += 20;

  // Activity Properties
  doc.text(`عدد الغرف: ${formData.roomCount}`, 10, yOffset);
  yOffset += 10;
  doc.text(`عدد القاعات: ${formData.hallCount}`, 10, yOffset);
  yOffset += 10;
  doc.text(`طاقة الاستيعاب (بالمبيت): ${formData.capacity.accommodation}`, 10, yOffset);
  yOffset += 10;
  doc.text(`طاقة الاستيعاب (تحت الخيام): ${formData.capacity.tents}`, 10, yOffset);
  yOffset += 10;
  doc.text(`طاقة الاستيعاب (بفضائات التنشيط): ${formData.capacity.activitySpaces}`, 10, yOffset);
  yOffset += 20;

  // Services Section
  doc.text(`الخدمات المقدمة: ${formData.services.join(", ")}`, 10, yOffset);
  yOffset += 10;
  doc.text(`طبيعة المشروع: ${formData.projectNature}`, 10, yOffset);
  yOffset += 10;
  doc.text(`عدد مواطن الشغل: ${formData.placecount}`, 10, yOffset);
  yOffset += 20;

  // Director Information
  doc.text(`اسم المدير: ${formData.directorName}`, 10, yOffset);
  yOffset += 10;
  doc.text(`رقم بطاقة المدير: ${formData.directorId.join("")}`, 10, yOffset);
  yOffset += 10;
  doc.text(`شهادة المدير: ${formData.directorCertification}`, 10, yOffset);
  yOffset += 20;

  // Investment Section
  doc.text(`نوع الاستثمار: ${formData.investmentType.join(", ")}`, 10, yOffset);
  yOffset += 10;
  doc.text(`التعريف بالمستثمر: ${formData.investorInfo}`, 10, yOffset);
  yOffset += 10;
  doc.text(`الاسم التجاري: ${formData.commercialName}`, 10, yOffset);
  yOffset += 10;
  doc.text(`عنوان المقر الاجتماعي: ${formData.socialAddress}`, 10, yOffset);
  yOffset += 10;
  doc.text(`الولاية: ${formData.state}`, 10, yOffset);
  yOffset += 10;
  doc.text(`المعتمدية: ${formData.district}`, 10, yOffset);
  yOffset += 10;
  doc.text(`البلدية: ${formData.municipality}`, 10, yOffset);
  yOffset += 10;
  doc.text(`الرمز البريدي: ${formData.postalCode}`, 10, yOffset);
  yOffset += 20;

  // Women & Childhood Activities
  doc.text(`طبيعة النشاط: ${formData.activityNature.join(", ")}`, 10, yOffset);
  yOffset += 10;
  doc.text(`اسم المشروع: ${formData.projectName}`, 10, yOffset);
  yOffset += 10;
  doc.text(`عنوان المشروع: ${formData.projectAddress}`, 10, yOffset);
  yOffset += 10;
  doc.text(`البريد الإلكتروني: ${formData.email}`, 10, yOffset);
  yOffset += 20;

  // Funding and Expenses
  doc.text(`إجمالي التمويل: ${fundingTotal}`, 10, yOffset);
  yOffset += 10;
  doc.text(`إجمالي المصروفات: ${expensesTotal}`, 10, yOffset);
  yOffset += 20;

  // Declaration
  doc.text(`الإقرار: ${formData.declaration ? "نعم" : "لا"}`, 10, yOffset);
  yOffset += 10;
  doc.text(`تاريخ التوقيع: ${new Date(formData.signatureDate).toLocaleDateString()}`, 10, yOffset);
  yOffset += 10;

  // Save the PDF

  doc.save("استمارة_تنظيم_الأنشطة_الترفيهية.pdf");
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          idNumber: formData.idNumber.join(""),
          directorId: formData.directorId.join(""),
          activitySpaces: formData.activitySpaces.join(","),
          services: formData.services.join(","),
          investmentType: formData.investmentType.join(","),
          investmentNature: formData.investmentNature.join(","),
          activityNature: formData.activityNature.join(","),
          capacity: {
            accommodation: Number(formData.capacity.accommodation),
            tents: Number(formData.capacity.tents),
            activitySpaces: Number(formData.capacity.activitySpaces)
          },
          funding: formData.funding.map(Number),
          expenses: formData.expenses.map(Number),
          roomCount: Number(formData.roomCount),
          hallCount: Number(formData.hallCount),
          placecount: Number(formData.placecount)
        }),

      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result.message);
      alert("تم إرسال النموذج بنجاح!");

      generatePDF();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.");
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.formTitle}>استمارة تنظيم الأنشطة الترفيهية</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>المستثمر</legend>

          <div className={styles.formGroup}>
            <label htmlFor="name">الاسم:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="surname">اللقب:</label>
            <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob">تاريخ الولادة:</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>رقم البطاقة الوطنية:</label>
            <div className={styles.idInputContainer}>
              {formData.idNumber.map((digit, index) => (
                <input
                  key={index}
                  className={styles.idDigit}
                  id={`idNumber-${index}`}
                  value={digit}
                  maxLength={1}
                  required
                  onChange={(e) => handleIdNumber(index, e.target.value, "idNumber")}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="issueDateAndPlace">تاريخ ومكان الإصدار:</label>
            <input
              type="text"
              id="issueDateAndPlace"
              name="issueDateAndPlace"
              value={formData.issueDateAndPlace}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">العنوان الشخصي:</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="educationLevel">المستوى التعليمي:</label>
            <input
              type="text"
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="latestDegree">آخر شهادة متحصل عليها:</label>
            <input
              type="text"
              id="latestDegree"
              name="latestDegree"
              value={formData.latestDegree}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="experience">الأقدمية في النشاط:</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        {/* Activity Properties Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>خاصيات النشاط</legend>

          <div className={styles.checkboxGroup}>
            <label>المؤسسة الشبابية الخاصة:</label>
            {["فضاء اقامة وتغذية", "فضاء تخييم", "فضاء تنشيط"].map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="activitySpaces"
                  value={option}
                  checked={formData.activitySpaces.includes(option)}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="roomCount">عدد الغرف:</label>
              <input
                type="number"
                id="roomCount"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hallCount">عدد القاعات:</label>
              <input
                type="number"
                id="hallCount"
                name="hallCount"
                value={formData.hallCount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.capacityGroup}>
            <h3>طاقة الاستيعاب:</h3>
            <div className={styles.inputGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="capacity.accommodation">بالمبيت:</label>
                <input
                  type="number"
                  id="capacity.accommodation"
                  name="capacity.accommodation"
                  value={formData.capacity.accommodation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="capacity.tents">تحت الخيام:</label>
                <input
                  type="number"
                  id="capacity.tents"
                  name="capacity.tents"
                  value={formData.capacity.tents}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="capacity.activitySpaces">بفضائات التنشيط:</label>
                <input
                  type="number"
                  id="capacity.activitySpaces"
                  name="capacity.activitySpaces"
                  value={formData.capacity.activitySpaces}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Services Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>الخدمات المقدمة</legend>

          <div className={styles.checkboxGroup}>
            {["الإقامة والتغذية", "إيواء التربصات", "التخييم", "الرحلات", "الحفلات"].map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="services"
                  value={option}
                  checked={formData.services.includes(option)}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="commercialName">الاسم التجاري:</label>
            <input
              type="text"
              id="commercialName1"
              name="commercialName"
              value={formData.commercialName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.radioGroup}>
            <label>طبيعة المشروع:</label>
            {["تسوية قديمة", "توسيع", "احداث"].map((option) => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="projectNature"
                  value={option}
                  checked={formData.projectNature === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="placecount">عدد مواطن الشغل:</label>
            <input
              type="number"
              id="placecount"
              name="placecount"
              value={formData.placecount}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        {/* Director Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>مدير المؤسسة</legend>

          <div className={styles.formGroup}>
            <label htmlFor="directorName">الاسم الكامل:</label>
            <input
              type="text"
              id="directorName"
              name="directorName"
              value={formData.directorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>رقم البطاقة:</label>
            <div className={styles.idInputContainer}>
              {formData.directorId.map((digit, index) => (
                <input
                  key={index}
                  className={styles.idDigit}
                  id={`directorId-${index}`}
                  value={digit}
                  maxLength={1}
                  required
                  onChange={(e) => handleIdNumber(index, e.target.value, "directorId")}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="directorCertification">الشهادة الأخيرة:</label>
            <input
              type="text"
              id="directorCertification"
              name="directorCertification"
              value={formData.directorCertification}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        {/* Investment Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>تنضيم الرحلات خارج الولاية</legend>

          <div className={styles.checkboxGroup}>
            <label>الاستثمار في هذا النشاط:</label>
            {["فضاء إقامة", "فضاء تخييم", "فضاء تشيط"].map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="investmentType"
                  value={option}
                  checked={formData.investmentType.includes(option)}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="investorInfo">التعريف بالمستثمر:</label>
            <input
              type="text"
              id="investorInfo"
              name="investorInfo"
              value={formData.investorInfo}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="commercialName">الاسم التجاري:</label>
            <input
              type="text"
              id="commercialName"
              name="commercialName"
              value={formData.commercialName}
              onChange={handleChange}
              required
            />
          </div>
          <label htmlFor="socialAddress">عنوان المقر الاجتماعي:</label>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="socialAddress"
              name="socialAddress"
              value={formData.socialAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="state">الولاية:</label>
              <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="district">المعتمدية:</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="municipality">البلدية:</label>
              <input
                type="text"
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="postalCode">الرمز البريدي:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Women & Childhood Activities Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>تنظيم الأنشطة الترفيهية للشباب و الطفولة</legend>

          <div className={styles.checkboxGroup}>
            <label>الاستثمار في هذا النشاط:</label>
            {["كشخص طبيعي", "كهيكل جمعياتي", "كمؤسسة خاصة"].map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="investmentNature"
                  value={option}
                  checked={formData.investmentNature.includes(option)}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          <div className={styles.checkboxGroup}>
            <label>طبيعة النشاط:</label>
            {["رحلات داخلية", "مصائف و مخيمات", "ملتقيات"].map((option) => (
              <label key={option} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="activityNature"
                  value={option}
                  checked={formData.activityNature.includes(option)}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="projectName">اسم المشروع:</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectAddress">عنوان المشروع:</label>
            <input
              type="text"
              id="projectAddress"
              name="projectAddress"
              value={formData.projectAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">البريد الإلكتروني:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.financeTable}>
            <table>
              <thead>
                <tr>
                  <th>الاستثمار</th>
                  <th>المبلغ</th>
                  <th>التمويل</th>
                  <th>المبلغ</th>
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
                  <tr key={index}>
                    <td>{fundingLabel}</td>
                    <td>
                      <input
                        type="number"
                        className={styles.tableInput}
                        name={`funding[${index}]`}
                        value={formData.funding[index]}
                        onChange={handleChange}
                      />
                    </td>
                    <td>{expenseLabel}</td>
                    <td>
                      <input
                        type="number"
                        className={styles.tableInput}
                        name={`expenses[${index}]`}
                        value={formData.expenses[index]}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>المجموع</th>
                  <th>{fundingTotal}</th>
                  <th>المجموع</th>
                  <th>{expensesTotal}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </fieldset>

        {/* Declaration Section */}
        <fieldset className={styles.formSection}>
          <legend className={styles.sectionTitle}>الإقرار</legend>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={(e) => setFormData((prev) => ({ ...prev, declaration: e.target.checked }))}
            />
            أقر بصحة جميع البيانات المقدمة
          </label>

          <div className={styles.formGroup}>
            <label htmlFor="signatureDate">تاريخ التوقيع:</label>
            <input
              type="date"
              id="signatureDate"
              name="signatureDate"
              value={formData.signatureDate}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        <button type="submit" className={styles.submitBtn}>
          إرسال الطلب
        </button>
      </form>
    </div>
  )
}