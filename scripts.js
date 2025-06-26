// Global variables
let directorCount = 0
const formData = {
  companyName: "",
  companyType: "",
  registrationNumber: "",
  registeredAddress: "",
  companyWebsite: "",
  companyEmail: "",
  companyPhone: "",
  companyLogo: null,
  needsLogo: false,
  additionalServices: [],
  directors: [],
}

// Additional Services Data
const additionalServices = [
  { id: "logo-design", name: "Logo Design", price: 1500 },
  { id: "business-cards", name: "Business Card Design & Printing (100 units)", price: 850 },
  { id: "full-branding", name: "Full Branding & Visual Identity Package", price: 4500 },
  { id: "company-profile", name: "Company Profile eBook", price: 2800 },
  { id: "business-plan", name: "Business Plan Development", price: 6500 },
  { id: "product-catalog", name: "Product & Services Catalog", price: 3200 },
  { id: "bee-certificate", name: "BEE Certificate Application Support", price: 3500 },
  { id: "vat-registration", name: "VAT Registration & Tax Compliance", price: 1800 },
  { id: "uif-registration", name: "UIF Registration (Company & Employees)", price: 1200 },
  { id: "payroll-setup", name: "Payroll & HR System Setup", price: 2500 },
  { id: "accounting-reporting", name: "Accounting and Financial Reporting (Monthly)", price: 2800 },
  { id: "accounting-software", name: "Accounting Software Setup (Xero/QuickBooks/Sage)", price: 1800 },
  { id: "business-banking", name: "Business Banking Setup & Account Opening", price: 1200 },
  { id: "website-email-dev", name: "Development Website & Business Email Address", price: 3500 },
  { id: "website-development", name: "Website Design & Development", price: 8500 },
  { id: "ecommerce-website", name: "eCommerce Website Development", price: 15000 },
  { id: "social-media-setup", name: "Social Media Setup & Optimization", price: 1800 },
  { id: "content-creation", name: "Content Creation & Copywriting (Monthly)", price: 3500 },
  { id: "paid-advertising", name: "Paid Social Media Advertising (Monthly Management)", price: 5500 },
  { id: "google-ads", name: "Google Ads Management (Monthly)", price: 4800 },
]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeWelcomeScreen()
  initializeEventListeners()
  initializeFireworks()
  renderAdditionalServices()

  // Set submission date
  document.getElementById("submissionDateInput").value = new Date().toISOString()
})

// Welcome Screen Functions
function initializeWelcomeScreen() {
  setTimeout(() => {
    document.getElementById("welcomeScreen").style.display = "none"
    document.getElementById("mainContent").classList.remove("hidden")
  }, 4000)
}

function initializeFireworks() {
  const fireworksContainer = document.querySelector(".fireworks-container")
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b", "#eb4d4b", "#6c5ce7"]

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      createFirework(fireworksContainer, colors)
    }, i * 300)
  }

  // Continue creating fireworks during welcome screen
  const fireworkInterval = setInterval(() => {
    if (document.getElementById("welcomeScreen").style.display === "none") {
      clearInterval(fireworkInterval)
      return
    }
    createFirework(fireworksContainer, colors)
  }, 800)
}

function createFirework(container, colors) {
  const firework = document.createElement("div")
  firework.className = "firework"
  firework.style.left = Math.random() * 100 + "%"
  firework.style.top = Math.random() * 100 + "%"
  firework.style.background = colors[Math.floor(Math.random() * colors.length)]

  // Create sparks
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement("div")
    spark.className = "spark"
    spark.style.setProperty("--i", i)
    firework.appendChild(spark)
  }

  container.appendChild(firework)

  setTimeout(() => {
    if (container.contains(firework)) {
      container.removeChild(firework)
    }
  }, 2000)
}

// Event Listeners
function initializeEventListeners() {
  // Form submission
  document.getElementById("registrationForm").addEventListener("submit", handleFormSubmit)

  // Progress tracking
  const formInputs = document.querySelectorAll("input[required], select[required]")
  formInputs.forEach((input) => {
    input.addEventListener("input", updateProgress)
    input.addEventListener("change", updateProgress)
  })

  // Director management
  document.getElementById("addDirectorBtn").addEventListener("click", addDirector)

  // Website helper
  document.getElementById("websiteHelperBtn").addEventListener("click", toggleWebsiteHelper)
  document.getElementById("closeWebsiteHelper").addEventListener("click", closeWebsiteHelper)

  // File uploads
  document.getElementById("companyLogo").addEventListener("change", (e) => {
    handleFileUpload(e.target)
  })
}

// Render Additional Services
function renderAdditionalServices() {
  const container = document.getElementById("servicesContainer")
  container.innerHTML = additionalServices
    .map(
      (service) => `
        <div class="service-card" data-id="${service.id}" data-price="${service.price}">
            <div class="flex items-center space-x-3">
                <input type="checkbox" name="additionalServices" value="${service.name} - R${service.price.toLocaleString()}" 
                       class="rounded text-purple-600" onchange="handleServiceChange(event)">
                <div class="flex items-center space-x-2 flex-1">
                    <span class="text-sm font-medium">${service.name}</span>
                </div>
                <span class="text-lg font-bold text-green-600">R${service.price.toLocaleString()}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Progress Bar Functions
function updateProgress() {
  const requiredFields = [
    document.getElementById("companyName").value.trim(),
    document.getElementById("companyType").value,
    document.getElementById("registeredAddress").value.trim(),
    document.getElementById("companyEmail").value.trim(),
    document.getElementById("companyPhone").value.trim(),
  ]

  const filledRequiredFields = requiredFields.filter((field) => field !== "").length
  const directorsProgress = formData.directors.length > 0 ? 20 : 0
  const baseProgress = (filledRequiredFields / requiredFields.length) * 80
  const totalProgress = Math.round(baseProgress + directorsProgress)

  document.querySelector(".progress-fill").style.width = totalProgress + "%"
  document.querySelector(".progress-percentage").textContent = totalProgress + "%"
}

// Director Management Functions
function addDirector() {
  directorCount++
  const director = {
    id: Date.now().toString(),
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    phone: "",
    address: "",
    idCopy: null,
    proofOfResidence: null,
  }

  formData.directors.push(director)
  renderDirectors()
  updateProgress()
  updateDirectorsData()
}

function removeDirector(directorId) {
  formData.directors = formData.directors.filter((d) => d.id !== directorId)
  renderDirectors()
  updateProgress()
  updateDirectorsData()
}

function updateDirectorsData() {
  // Update hidden fields for Netlify submission
  document.getElementById("numberOfDirectorsInput").value = formData.directors.length
  document.getElementById("directorsDataInput").value = JSON.stringify(
    formData.directors.map((d) => ({
      firstName: d.firstName,
      lastName: d.lastName,
      idNumber: d.idNumber,
      email: d.email,
      phone: d.phone,
      address: d.address,
    })),
  )
}

function renderDirectors() {
  const container = document.getElementById("directorsContainer")

  if (formData.directors.length === 0) {
    container.innerHTML = `
            <div class="no-directors text-center py-8 text-gray-500">
                <i class="fas fa-building text-5xl text-gray-300 mb-4"></i>
                <p>No directors added yet. Click "Add Director" to get started! 🚀</p>
            </div>
        `
    return
  }

  container.innerHTML = formData.directors
    .map(
      (director, index) => `
        <div class="director-card border rounded-lg p-6 bg-gradient-to-r from-yellow-50 to-orange-50 mb-6" data-director-id="${director.id}">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    👨‍💼 Director ${index + 1}
                </h3>
                <button type="button" class="remove-director-btn text-red-600 border border-red-200 hover:bg-red-50 px-2 py-1 rounded-md" 
                        onclick="removeDirector('${director.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">First Name *</label>
                    <input type="text" name="director_${index + 1}_firstName" placeholder="Enter first name" 
                           value="${director.firstName}" 
                           onchange="updateDirectorField('${director.id}', 'firstName', this.value)" 
                           class="director-field w-full px-3 py-2 border rounded-md" required>
                </div>
                
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input type="text" name="director_${index + 1}_lastName" placeholder="Enter last name" 
                           value="${director.lastName}" 
                           onchange="updateDirectorField('${director.id}', 'lastName', this.value)" 
                           class="director-field w-full px-3 py-2 border rounded-md" required>
                </div>
                
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">ID Number *</label>
                    <input type="text" name="director_${index + 1}_idNumber" placeholder="Enter ID number" 
                           value="${director.idNumber}" 
                           onchange="updateDirectorField('${director.id}', 'idNumber', this.value)" 
                           class="director-field w-full px-3 py-2 border rounded-md" required>
                </div>
                
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Email Address *</label>
                    <input type="email" name="director_${index + 1}_email" placeholder="Enter email address" 
                           value="${director.email}" 
                           onchange="updateDirectorField('${director.id}', 'email', this.value)" 
                           class="director-field w-full px-3 py-2 border rounded-md" required>
                </div>
                
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="director_${index + 1}_phone" placeholder="Enter phone number" 
                           value="${director.phone}" 
                           onchange="updateDirectorField('${director.id}', 'phone', this.value)" 
                           class="director-field w-full px-3 py-2 border rounded-md">
                </div>
                
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Residential Address</label>
                    <input type="text" name="director_${index + 1}_address" placeholder="Enter residential address" 
                           value="${director.address}" 
                           onchange="updateDirectorField('${director.id}', 'address', this.value)" 
                           class="director-field w-full px-3 py-2 border rounded-md">
                </div>
            </div>

            <div class="border-t pt-4">
                <h4 class="text-md font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-file-text mr-2"></i>
                    Required Documents 📄
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">ID Copy (certified &lt; 3 Months) *</label>
                        <div class="upload-area director">
                            <input type="file" id="idCopy-${director.id}" name="director_${index + 1}_idCopy" 
                                   accept=".pdf,.jpg,.jpeg,.png,.gif" 
                                   onchange="handleDirectorFileUpload('${director.id}', 'idCopy', this)" class="hidden">
                            <label for="idCopy-${director.id}" class="cursor-pointer">
                                <i class="fas fa-upload text-3xl text-yellow-500 mb-2 block upload-icon"></i>
                                <p class="text-xs text-gray-600 upload-text">
                                    ${director.idCopy ? director.idCopy.name : "Upload ID Copy"}
                                </p>
                                <p class="text-xs text-gray-400">PDF, JPG, PNG, GIF up to 5MB</p>
                            </label>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Proof of Residence *</label>
                        <div class="upload-area director">
                            <input type="file" id="proofOfResidence-${director.id}" name="director_${index + 1}_proofOfResidence" 
                                   accept=".pdf,.jpg,.jpeg,.png,.gif" 
                                   onchange="handleDirectorFileUpload('${director.id}', 'proofOfResidence', this)" class="hidden">
                            <label for="proofOfResidence-${director.id}" class="cursor-pointer">
                                <i class="fas fa-upload text-3xl text-yellow-500 mb-2 block upload-icon"></i>
                                <p class="text-xs text-gray-600 upload-text">
                                    ${director.proofOfResidence ? director.proofOfResidence.name : "Upload Proof of Residence"}
                                </p>
                                <p class="text-xs text-gray-400">PDF, JPG, PNG, GIF up to 5MB</p>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function updateDirectorField(directorId, field, value) {
  const director = formData.directors.find((d) => d.id === directorId)
  if (director) {
    director[field] = value
    updateDirectorsData()
  }
}

function handleDirectorFileUpload(directorId, field, input) {
  const director = formData.directors.find((d) => d.id === directorId)
  if (director && input.files[0]) {
    // Validate file type and size
    const file = input.files[0]
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      showNotification("Invalid File Type", "Please upload PDF, JPG, PNG, or GIF files only.", "error")
      input.value = ""
      return
    }

    if (file.size > maxSize) {
      showNotification("File Too Large", "Please upload files smaller than 5MB.", "error")
      input.value = ""
      return
    }

    director[field] = {
      name: file.name,
      size: file.size,
      type: file.type,
    }

    // Update the display
    const label = input.nextElementSibling.querySelector(".upload-text")
    label.textContent = file.name

    // Add success styling
    input.parentElement.classList.add("file-uploaded")

    showNotification("File Uploaded", `${file.name} uploaded successfully!`, "success")
  }
}

// Additional Services Functions
function handleServiceChange(event) {
  const serviceCard = event.target.closest(".service-card")
  const serviceId = serviceCard.dataset.id
  const price = Number.parseInt(serviceCard.dataset.price)
  const serviceValue = event.target.value

  if (event.target.checked) {
    formData.additionalServices.push({ id: serviceId, price: price, value: serviceValue })
    serviceCard.classList.add("selected")
  } else {
    formData.additionalServices = formData.additionalServices.filter((s) => s.id !== serviceId)
    serviceCard.classList.remove("selected")
  }

  updateQuotation()
}

function updateQuotation() {
  const total = formData.additionalServices.reduce((sum, service) => sum + service.price, 0)
  const quotationCard = document.getElementById("quotationCard")
  const quotationAmount = quotationCard.querySelector(".quotation-amount")

  if (total > 0) {
    quotationCard.classList.remove("hidden")
    quotationAmount.textContent = `R${total.toLocaleString()} 💰`
    document.getElementById("totalQuotationInput").value = `R${total.toLocaleString()}`
  } else {
    quotationCard.classList.add("hidden")
    document.getElementById("totalQuotationInput").value = "R0"
  }
}

// Website Helper Functions
function toggleWebsiteHelper() {
  const helper = document.getElementById("websiteHelper")
  helper.classList.toggle("hidden")
}

function closeWebsiteHelper() {
  document.getElementById("websiteHelper").classList.add("hidden")
}

// File Upload Functions
function handleFileUpload(input) {
  const file = input.files[0]
  if (file) {
    // Validate file type and size
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      showNotification("Invalid File Type", "Please upload PDF, JPG, PNG, or GIF files only.", "error")
      input.value = ""
      return
    }

    if (file.size > maxSize) {
      showNotification("File Too Large", "Please upload files smaller than 10MB.", "error")
      input.value = ""
      return
    }

    formData.companyLogo = {
      name: file.name,
      size: file.size,
      type: file.type,
    }

    // Update display
    const label = input.nextElementSibling
    const uploadText = label.querySelector(".upload-text")
    uploadText.textContent = file.name

    // Add success styling
    input.parentElement.classList.add("file-uploaded")

    showNotification("File Uploaded", `${file.name} uploaded successfully!`, "success")
  }
}

// Form Submission
function handleFormSubmit(event) {
  // Validation
  if (!validateForm()) {
    event.preventDefault()
    return
  }

  // Save data to localStorage before submission
  const quotationData = {
    companyName: document.getElementById("companyName").value,
    companyType: document.getElementById("companyType").value,
    companyEmail: document.getElementById("companyEmail").value,
    companyPhone: document.getElementById("companyPhone").value,
    companyAddress: document.getElementById("registeredAddress").value,
    companyWebsite: document.getElementById("companyWebsite").value,
    directors: formData.directors,
    additionalServices: formData.additionalServices,
    submissionDate: new Date().toISOString(),
  }

  localStorage.setItem("quotationData", JSON.stringify(quotationData))

  // Update hidden fields before submission
  updateDirectorsData()
  document.getElementById("submissionDateInput").value = new Date().toISOString()

  // Show success notification
  showNotification("Form Submitted! 🎉", "Redirecting to success page...", "success")

  // Form will continue to submit to Netlify and redirect to success.html
}

function validateForm() {
  // Check required company fields
  if (
    !document.getElementById("companyName").value ||
    !document.getElementById("companyType").value ||
    !document.getElementById("registeredAddress").value ||
    !document.getElementById("companyEmail").value ||
    !document.getElementById("companyPhone").value
  ) {
    showNotification("Validation Error", "Please fill in all required company information fields.", "error")
    return false
  }

  // Check directors
  if (formData.directors.length === 0) {
    showNotification("Validation Error", "At least one director is required for company registration.", "error")
    return false
  }

  // Check director completeness
  const incompleteDirectors = formData.directors.some(
    (director) => !director.firstName || !director.lastName || !director.idNumber || !director.email,
  )

  if (incompleteDirectors) {
    showNotification("Validation Error", "Please complete all director information fields.", "error")
    return false
  }

  return true
}

// Notification System
function showNotification(title, message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add to page
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}
