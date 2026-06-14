import { BadgeCheck, Search, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import PublicPageLayout from '../components/PublicPageLayout';

const CertificateVerifyScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [number, setNumber] = useState(searchParams.get('numero') ?? '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verify = async (certificateNumber) => {
    const normalized = certificateNumber.trim().toUpperCase();
    if (!normalized) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        `/api/certificate-verify?number=${encodeURIComponent(normalized)}`,
      );
      const data = await response.json();
      setResult(data);
      setSearchParams({ numero: normalized }, { replace: true });
    } catch {
      setResult({
        ok: false,
        error: 'No pudimos consultar el certificado en este momento.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialNumber = searchParams.get('numero');
    if (initialNumber) verify(initialNumber);
    // La consulta inicial solo se ejecuta al abrir la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PublicPageLayout
      description="Consulta un certificado digital emitido por W Studio."
      eyebrow="Validación pública"
      title="Verificar certificado"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          verify(number);
        }}
      >
        <label className="block">
          <span className="text-sm font-black text-ink">
            Número de certificado
          </span>
          <input
            required
            autoCapitalize="characters"
            className="mt-2 min-h-14 w-full rounded-2xl border border-gray-200 px-4 text-sm font-bold uppercase text-ink outline-none focus:border-violet"
            placeholder="WST-CPE-AAAAMMDD-XXXXXXXX"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </label>
        <PrimaryButton loading={loading} type="submit">
          <Search className="h-5 w-5" />
          Verificar
        </PrimaryButton>
      </form>

      {result?.valid && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <BadgeCheck className="h-10 w-10 text-emerald-600" />
          <p className="mt-4 text-xs font-black uppercase text-emerald-700">
            Certificado válido
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">
            {result.certificate.studentName}
          </h2>
          <p className="mt-2 text-sm font-semibold text-muted">
            {result.certificate.certificateTitle}
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-black text-muted">Número</dt>
              <dd className="mt-1 break-all font-bold text-ink">
                {result.certificate.certificateNumber}
              </dd>
            </div>
            <div>
              <dt className="font-black text-muted">Emitido por</dt>
              <dd className="mt-1 font-bold text-ink">
                {result.certificate.issuer}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {result && !result.valid && (
        <section className="flex gap-3 rounded-3xl bg-red-50 p-5 text-red-800">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0" />
          <p className="text-sm font-semibold leading-relaxed">
            {result.error}
          </p>
        </section>
      )}
    </PublicPageLayout>
  );
};

export default CertificateVerifyScreen;

