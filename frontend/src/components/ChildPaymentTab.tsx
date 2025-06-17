//  import React, { useState, useEffect } from "react";
//  import { FaMoneyBillWave, FaCalendarAlt, FaChild, FaClock, FaMobile, FaExclamationTriangle, FaCheckCircle, FaSpinner } from "react-icons/fa";
//  import { motion } from "framer-motion";
//  import { toast } from "react-toastify";
//  import { useLocation, useParams } from "react-router-dom";
//  import { checkTransactionStatus, createMoMoPayment, getUnpaidTuitionByParent } from "../services/apiPayment";

//  interface ChildPaymentTabProps {
//      idHocSinh: number;
//  }

//  const ChildPaymentTab: React.FC<ChildPaymentTabProps> = ({ idHocSinh }) => {
//      const [unpaidTuition, setUnpaidTuition] = useState<any[]>([]);
//      const [isLoading, setIsLoading] = useState(false);
//      const [payingId, setPayingId] = useState<number | null>(null);
//      const token = localStorage.getItem("token");

//      const fetchUnpaidTuition = async () => {
//          setIsLoading(true);
//          try {
//              if (!token || !idHocSinh) {
//                  toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
//                  return;
//              }
//              const response = await getUnpaidTuitionByParent(Number(idHocSinh));
//              if (response.success && response.data) {
//                  setUnpaidTuition(response.data);
//              } else {
//                  setUnpaidTuition([]);
//              }
//          } catch (error: any) {
//              console.error("Lỗi khi gọi API:", error);
//              toast.error("Không thể tải danh sách học phí. Vui lòng thử lại sau.");
//          } finally {
//              setIsLoading(false);
//          }
//      };

//      useEffect(() => {
//          fetchUnpaidTuition();
//          const searchParams = new URLSearchParams(location.search);
//          const orderId = searchParams.get("orderId");
//          if (orderId) {
//              handleCheckStatus(orderId);
//          }
//           eslint-disable-next-line
//      }, [idHocSinh]);

//      const handlePayWithMomo = async (tuition: any) => {
//          setPayingId(tuition.IDHocPhi);
//          try {
//              const paymentRequest = {
//                  IDHocPhi: tuition.IDHocPhi,
//                  soTien: parseFloat(tuition.soTien),
//                  noiDung: `Thanh toán học phí tháng ${tuition.thang}/${tuition.nam} cho ${tuition.tenHocSinh}`,
//              };
//              toast.info("Đang khởi tạo giao dịch thanh toán...", { autoClose: 3000 });
//              const response = await createMoMoPayment(paymentRequest);
//              if (response.success && response.data && response.data.payUrl) {
//                  window.open(response.data.payUrl, "_blank", "noopener,noreferrer");
//                  toast.success("Đã mở cổng thanh toán MoMo!");
//              } else {
//                  toast.error("Không thể khởi tạo thanh toán MoMo. Vui lòng thử lại sau.");
//              }
//          } catch (error: any) {
//              console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
//              toast.error("Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.");
//          } finally {
//              setPayingId(null);
//          }
//      };

//      const handleCheckStatus = async (orderId: string) => {
//          try {
//              const response = await checkTransactionStatus(orderId);
//              if (response.success && response.resultCode === 0) {
//                  toast.success("Thanh toán thành công! Cảm ơn bạn đã thanh toán học phí.");
//                  fetchUnpaidTuition();
//              } else {
//                  toast.warning("Thanh toán thất bại hoặc chưa hoàn tất. Vui lòng thử lại.");
//              }
//          } catch (error) {
//              console.error("Lỗi khi kiểm tra trạng thái giao dịch:", error);
//              toast.error("Không thể kiểm tra trạng thái giao dịch.");
//          }
//      };

//      return (
//          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-amber-50 py-6">
//              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                  {/* Header */}
//                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
//                      <div className="flex items-center mb-4 md:mb-0">
//                          <div className="bg-amber-100 p-3 rounded-full mr-4">
//                              <FaMoneyBillWave className="text-amber-600 text-2xl" />
//                          </div>
//                          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Thanh Toán Học Phí</h1>
//                      </div>
//                  </div>

//                  {/* Thông tin học phí */}
//                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                          <h2 className="text-lg font-medium text-gray-800 flex items-center">
//                              <FaCalendarAlt className="text-amber-500 mr-2" />
//                              Danh sách học phí chưa thanh toán
//                          </h2>
//                      </div>

//                      {isLoading ? (
//                          <div className="text-center py-16">
//                              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                              <p className="text-gray-600">Đang tải dữ liệu học phí...</p>
//                          </div>
//                      ) : unpaidTuition.length > 0 ? (
//                          <div className="overflow-x-auto">
//                              <table className="min-w-full divide-y divide-gray-200">
//                                  <thead className="bg-gray-50">
//                                      <tr>
//                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
//                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỳ học phí</th>
//                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
//                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn thanh toán</th>
//                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
//                                      </tr>
//                                  </thead>
//                                  <tbody className="bg-white divide-y divide-gray-200">
//                                      {unpaidTuition.map((tuition) => (
//                                          <tr key={tuition.IDHocPhi} className="hover:bg-amber-50 transition duration-150">
//                                              <td className="px-6 py-4 whitespace-nowrap">
//                                                  <div className="flex items-center">
//                                                      <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
//                                                          <FaChild className="text-amber-500" />
//                                                      </div>
//                                                      <div className="ml-4">
//                                                          <div className="text-sm font-medium text-gray-900">{tuition.tenHocSinh}</div>
//                                                          <div className="text-xs text-gray-500">{tuition.maHocSinh || "Học sinh"}</div>
//                                                      </div>
//                                                  </div>
//                                              </td>
//                                              <td className="px-6 py-4 whitespace-nowrap">
//                                                  <div className="flex items-center">
//                                                      <FaCalendarAlt className="text-amber-500 mr-2" />
//                                                      <div className="text-sm text-gray-900">
//                                                          Tháng {tuition.thang}/{tuition.nam}
//                                                      </div>
//                                                  </div>
//                                              </td>
//                                              <td className="px-6 py-4 whitespace-nowrap">
//                                                  <div className="text-sm font-medium text-gray-900">{Number(tuition.soTien).toLocaleString("vi-VN")} VNĐ</div>
//                                              </td>
//                                              <td className="px-6 py-4 whitespace-nowrap">
//                                                  <div className="text-sm text-gray-900">{new Date(tuition.hanCuoi).toLocaleDateString("vi-VN")}</div>
//                                                  {new Date(tuition.hanCuoi) < new Date() && (
//                                                      <span className="text-xs text-red-600 flex items-center mt-1">
//                                                          <FaExclamationTriangle className="mr-1" /> Quá hạn
//                                                      </span>
//                                                  )}
//                                              </td>
//                                              <td className="px-6 py-4 whitespace-nowrap">
//                                                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
//                                                      <FaClock className="mr-1 mt-0.5" /> Chưa thanh toán
//                                                  </span>
//                                              </td>
//                                              <td className="px-6 py-4 whitespace-nowrap">
//                                                  <button
//                                                      onClick={() => handlePayWithMomo(tuition)}
//                                                      disabled={payingId === tuition.IDHocPhi}
//                                                      className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center w-36"
//                                                  >
//                                                      {payingId === tuition.IDHocPhi ? (
//                                                          <>
//                                                              <FaSpinner className="animate-spin mr-2" /> Đang xử lý
//                                                          </>
//                                                      ) : (
//                                                          <>
//                                                              <FaMobile className="mr-1" /> Thanh toán MoMo
//                                                          </>
//                                                      )}
//                                                  </button>
//                                              </td>
//                                          </tr>
//                                      ))}
//                                  </tbody>
//                              </table>
//                          </div>
//                      ) : (
//                          <div className="py-16 text-center">
//                              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
//                                  <FaCheckCircle className="text-green-500 text-3xl" />
//                              </div>
//                              <h3 className="text-xl font-medium text-gray-800 mb-2">Không có khoản học phí nào chưa thanh toán</h3>
//                              <p className="text-gray-600 max-w-md mx-auto">Cảm ơn bạn đã thanh toán đầy đủ học phí. Việc thanh toán đúng hạn giúp nhà trường duy trì chất lượng giáo dục tốt nhất.</p>
//                          </div>
//                      )}

//                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
//                              <div className="mb-3 sm:mb-0">
//                                  <p>Học phí được cập nhật hàng tháng. Vui lòng thanh toán đúng hạn.</p>
//                              </div>
//                              <div className="flex items-center">
//                                  <FaMoneyBillWave className="text-amber-500 mr-2" />
//                                  <span>Thanh toán an toàn qua MoMo</span>
//                              </div>
//                          </div>
//                      </div>
//                  </div>

//                  {/* Hướng dẫn thanh toán */}
//                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                          <h2 className="text-lg font-medium text-gray-800">Hướng dẫn thanh toán</h2>
//                      </div>
//                      <div className="p-6">
//                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                              <div className="bg-amber-50 p-4 rounded-lg">
//                                  <div className="text-center mb-2">
//                                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-500 text-lg font-bold">1</span>
//                                  </div>
//                                  <h3 className="text-center font-medium mb-2">Chọn khoản học phí</h3>
//                                  <p className="text-sm text-gray-600 text-center">Nhấn nút "Thanh toán MoMo" tương ứng với khoản học phí bạn muốn thanh toán.</p>
//                              </div>
//                              <div className="bg-amber-50 p-4 rounded-lg">
//                                  <div className="text-center mb-2">
//                                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-500 text-lg font-bold">2</span>
//                                  </div>
//                                  <h3 className="text-center font-medium mb-2">Thanh toán qua MoMo</h3>
//                                  <p className="text-sm text-gray-600 text-center">Bạn sẽ được chuyển hướng đến cổng thanh toán MoMo để hoàn tất giao dịch.</p>
//                              </div>
//                              <div className="bg-amber-50 p-4 rounded-lg">
//                                  <div className="text-center mb-2">
//                                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-500 text-lg font-bold">3</span>
//                                  </div>
//                                  <h3 className="text-center font-medium mb-2">Xác nhận thanh toán</h3>
//                                  <p className="text-sm text-gray-600 text-center">Sau khi thanh toán thành công, trạng thái học phí sẽ được tự động cập nhật.</p>
//                              </div>
//                          </div>
//                      </div>
//                  </div>
//              </div>
//          </motion.div>
//      );
//  };

//  export default ChildPaymentTab;

import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaCalendarAlt, FaChild, FaClock, FaMobile, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { checkTransactionStatus, createMoMoPayment, getUnpaidTuitionByParent, getPaidTuitionByParent } from "../services/apiPayment";

interface ChildPaymentTabProps {
    idHocSinh: number;
}

const ChildPaymentTab: React.FC<ChildPaymentTabProps> = ({ idHocSinh }) => {
    const [activeTab, setActiveTab] = useState<"unpaid" | "paid">("unpaid");
    const [unpaidTuition, setUnpaidTuition] = useState<any[]>([]);
    const [paidTuition, setPaidTuition] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [payingId, setPayingId] = useState<number | null>(null);
    const token = localStorage.getItem("token");
    const location = useLocation();

    //   Lấy danh sách học phí chưa thanh toán
    const fetchUnpaidTuition = async () => {
        setIsLoading(true);
        try {
            if (!token || !idHocSinh) {
                toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
                return;
            }
            const response = await getUnpaidTuitionByParent(Number(idHocSinh));
            if (response.success && response.data) {
                setUnpaidTuition(response.data);
            } else {
                setUnpaidTuition([]);
            }
        } catch (error: any) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Không thể tải danh sách học phí. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    //  Lấy danh sách học phí đã thanh toán
    const fetchPaidTuition = async () => {
        setIsLoading(true);
        try {
            if (!token || !idHocSinh) {
                toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
                return;
            }
            const response = await getPaidTuitionByParent(Number(idHocSinh));
            if (response.success && response.data) {
                setPaidTuition(response.data);
            } else {
                setPaidTuition([]);
            }
        } catch (error: any) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Không thể tải danh sách học phí đã thanh toán.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "unpaid") {
            fetchUnpaidTuition();
        } else {
            fetchPaidTuition();
        }
        //    Kiểm tra trạng thái giao dịch nếu có orderId trên URL
        if (activeTab === "unpaid") {
            const searchParams = new URLSearchParams(location.search);
            const orderId = searchParams.get("orderId");
            if (orderId) {
                handleCheckStatus(orderId);
            }
        }
        //   eslint-disable-next-line
    }, [idHocSinh, activeTab]);

    const handlePayWithMomo = async (tuition: any) => {
        setPayingId(tuition.IDHocPhi);
        try {
            const paymentRequest = {
                IDHocPhi: tuition.IDHocPhi,
                soTien: parseFloat(tuition.soTien),
                noiDung: `Thanh toán học phí tháng ${tuition.thang}/${tuition.nam} cho ${tuition.tenHocSinh}`,
            };
            toast.info("Đang khởi tạo giao dịch thanh toán...", { autoClose: 3000 });
            const response = await createMoMoPayment(paymentRequest);
            if (response.success && response.data && response.data.payUrl) {
                window.open(response.data.payUrl, "_blank", "noopener,noreferrer");
                toast.success("Đã mở cổng thanh toán MoMo!");
            } else {
                toast.error("Không thể khởi tạo thanh toán MoMo. Vui lòng thử lại sau.");
            }
        } catch (error: any) {
            console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
            toast.error("Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.");
        } finally {
            setPayingId(null);
        }
    };

    const handleCheckStatus = async (orderId: string) => {
        try {
            const response = await checkTransactionStatus(orderId);
            if (response.success && response.resultCode === 0) {
                toast.success("Thanh toán thành công! Cảm ơn bạn đã thanh toán học phí.");
                fetchUnpaidTuition();
                fetchPaidTuition();
            } else {
                toast.warning("Thanh toán thất bại hoặc chưa hoàn tất. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái giao dịch:", error);
            toast.error("Không thể kiểm tra trạng thái giao dịch.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-amber-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === "unpaid" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("unpaid")}
                    >
                        Chưa thanh toán
                    </button>
                    <button className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === "paid" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setActiveTab("paid")}>
                        Đã thanh toán
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === "unpaid" ? (
                    <div>
                        {/* Thông tin học phí */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                                    <FaCalendarAlt className="text-amber-500 mr-2" />
                                    Danh sách học phí chưa thanh toán
                                </h2>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Đang tải dữ liệu học phí...</p>
                                </div>
                            ) : unpaidTuition.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỳ học phí</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn thanh toán</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {unpaidTuition.map((tuition) => (
                                                <tr key={tuition.IDHocPhi} className="hover:bg-amber-50 transition duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                                <FaChild className="text-amber-500" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{tuition.tenHocSinh}</div>
                                                                <div className="text-xs text-gray-500">{tuition.maHocSinh || "Học sinh"}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm text-gray-900">
                                                                Tháng {tuition.thang}/{tuition.nam}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{Number(tuition.soTien).toLocaleString("vi-VN")} VNĐ</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{new Date(tuition.hanCuoi).toLocaleDateString("vi-VN")}</div>
                                                        {new Date(tuition.hanCuoi) < new Date() && (
                                                            <span className="text-xs text-red-600 flex items-center mt-1">
                                                                <FaExclamationTriangle className="mr-1" /> Quá hạn
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">Chưa thanh toán</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handlePayWithMomo(tuition)}
                                                            disabled={payingId === tuition.IDHocPhi}
                                                            className="px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center w-22"
                                                        >
                                                            {payingId === tuition.IDHocPhi ? (
                                                                <>
                                                                    <FaSpinner className="animate-spin mr-2" /> Đang xử lý
                                                                </>
                                                            ) : (
                                                                <>Thanh toán</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                                        <FaCheckCircle className="text-green-500 text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">Không có khoản học phí nào chưa thanh toán</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Cảm ơn bạn đã thanh toán đầy đủ học phí. Việc thanh toán đúng hạn giúp nhà trường duy trì chất lượng giáo dục tốt nhất.
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
                                    <div className="mb-3 sm:mb-0">
                                        <p>Học phí được cập nhật hàng tháng. Vui lòng thanh toán đúng hạn.</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FaMoneyBillWave className="text-amber-500 mr-2" />
                                        <span>Thanh toán an toàn qua MoMo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-800 flex items-center">
                                <FaCheck className="text-green-500 mr-2" />
                                Danh sách học phí đã thanh toán
                            </h2>
                        </div>
                        {isLoading ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải dữ liệu học phí...</p>
                            </div>
                        ) : paidTuition.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỳ học phí</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thanh toán</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paidTuition.map((tuition) => (
                                            <tr key={tuition.IDHocPhi} className="hover:bg-amber-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                            <FaChild className="text-green-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{tuition.tenHocSinh}</div>
                                                            <div className="text-xs text-gray-500">{tuition.maHocSinh || "Học sinh"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FaCalendarAlt className="text-amber-500 mr-2" />
                                                        <div className="text-sm text-gray-900">
                                                            Tháng {tuition.thang}/{tuition.nam}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{Number(tuition.soTien).toLocaleString("vi-VN")} VNĐ</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{tuition.ngayThanhToan ? new Date(tuition.ngayThanhToan).toLocaleDateString("vi-VN") : ""}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                                                        <FaCheck className="mr-1 mt-0.5" /> Đã thanh toán
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                                    <FaCheckCircle className="text-green-500 text-3xl" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-2">Chưa có khoản học phí nào đã thanh toán</h3>
                                <p className="text-gray-600 max-w-md mx-auto">Khi bạn thanh toán học phí thành công, thông tin sẽ hiển thị tại đây.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Hướng dẫn thanh toán */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Hướng dẫn thanh toán</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-500 text-lg font-bold">1</span>
                                </div>
                                <h3 className="text-center font-medium mb-2">Chọn khoản học phí</h3>
                                <p className="text-sm text-gray-600 text-center">Nhấn nút "Thanh toán MoMo" tương ứng với khoản học phí bạn muốn thanh toán.</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-500 text-lg font-bold">2</span>
                                </div>
                                <h3 className="text-center font-medium mb-2">Thanh toán qua MoMo</h3>
                                <p className="text-sm text-gray-600 text-center">Bạn sẽ được chuyển hướng đến cổng thanh toán MoMo để hoàn tất giao dịch.</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <div className="text-center mb-2">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-500 text-lg font-bold">3</span>
                                </div>
                                <h3 className="text-center font-medium mb-2">Xác nhận thanh toán</h3>
                                <p className="text-sm text-gray-600 text-center">Sau khi thanh toán thành công, trạng thái học phí sẽ được tự động cập nhật.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChildPaymentTab;
